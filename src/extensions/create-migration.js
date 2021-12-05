module.exports = toolbox => {
  const { print, filesystem, template } = toolbox
  const { ntIsConfigured } = require('../core/setup-validator')
  const dateTime = require('node-datetime')

  async function load_config_file () {
    const config_file = filesystem.read('./nt.json', 'json')
    return config_file
  }

  async function generate (template_name, model) {
    await template.generate({
      template: template_name,
      target: model.full_dest,
      props: model.props
    })

    print.success(`   Generated ${model.full_name}`)
  }

  function get_type_migration_name (migration_type) {
    switch (migration_type) {
      case 'ct':
        return 'create-table'
        break
      case 'adc':
        return 'add-column'
        break
      default:
        return ''
        break
    }
  }

  function verify_multiple_type (migration_type) {
    if (migration_type == null) return false
    const split_type = migration_type.split(',')
    if (split_type.length > 1) {
      return true
    }
    return false
  }

  async function model_to_generate (
    params,
    migration_type,
    config_file,
    table_name
  ) {
    const date_time = dateTime.create().format('Y-m-d-HMS')
    const type_migration_name = get_type_migration_name(migration_type)
    const full_name = `${date_time}-${params}.xml`
    const full_dest = `src/main/resources/${config_file.liquibase.destination}/${full_name}`

    const props = {
      changeset_id: 1,
      table_name: table_name,
      author: 'nt-cli',
      columns: [
        {
          column_name: 'name',
          column_type: 'varchar(255)'
        },
        {
          column_name: 'email',
          column_type: 'varchar(255)'
        }
      ]
    }

    const model = {
      date_time: date_time,
      type_migration_name: type_migration_name,
      full_name: full_name,
      full_dest: full_dest,
      props: props
    }

    return model
  }

  async function execute_multiple_type (
    params,
    migration_type,
    config_file,
    table_name
  ) {
    const model = await model_to_generate(
      params,
      migration_type,
      config_file,
      table_name
    )

    const split = migration_type.split(',')
    const types = []

    for (i = 0; i < split.length; i++) {
      types.push(split[i])
    }

    const new_props = model.props
    new_props.types = types
    model.props = new_props

    await generate('multiple-types.js.ejs', model)
    await upsert_changelog_master(model.full_name, model.full_dest)
  }

  async function execute_single_type (
    params,
    migration_type,
    config_file,
    table_name
  ) {
    if (migration_type == null) {
      migration_type = 'ct'
    }

    const model = await model_to_generate(
      params,
      migration_type,
      config_file,
      table_name
    )

    switch (migration_type) {
      case 'ct':
        await generate('create-table.js.ejs', model)
        await upsert_changelog_master(model.full_name, model.full_dest)
        break
      case 'adc':
        await generate('add-column.js.ejs', model)
        await upsert_changelog_master(model.full_name, model.full_dest)
        break
      default:
        print.error('type ' + migration_type + ' not supported')
    }
  }

  async function upsert_changelog_master (file_name_migration, full_dest) {
    const model = {
      full_name: 'liquibase-changeLog.xml',
      full_dest: 'src/main/resources/db/liquibase-changeLog.xml',
      props: {
        migration_name: `changelogs/${file_name_migration}`
      }
    }

    if (filesystem.exists(model.full_dest) == false) {
      generate('changelog-master.js.ejs', model)
    } else {
      const text = filesystem.read(model.full_dest)
      const replacement = text.replace('</databaseChangeLog>', '')
      const updated_text =
        replacement +
        `<include file="changelog/${file_name_migration}" relativeToChangelogFile="true"/>` +
        '\n' +
        '</databaseChangeLog>'

      filesystem.write(model.full_dest, updated_text)

      print.success('   Updated liquibase-changeLog.xml')
    }
  }

  async function createMigration (params, migration_type, table_name) {
    const is_multiple_type = verify_multiple_type(migration_type)

    const setupConfigured = await ntIsConfigured(filesystem, print);
    if (!setupConfigured) {
      return
    }

    const config_file = await load_config_file()

    print.info('invoke liquibase')
    if (is_multiple_type) {
      execute_multiple_type(params, migration_type, config_file, table_name)
    } else {
      execute_single_type(params, migration_type, config_file, table_name)
    }
  }

  toolbox.createMigration = createMigration
}
