module.exports = (toolbox) => {
    const { print, parameters, prompt, filesystem, template } = toolbox
    var Pluralize = require('pluralize')
    var dateTime = require('node-datetime')

    async function load_config_file() {
        const config_file = filesystem.read('./nt.json', 'json')
        return config_file
    }

    async function generate(template_name, full_dest, props, full_name) {
        await template.generate({
            template: template_name, 
            target: full_dest, 
            props: props,
        })

        print.info('invoke liquibase')
        print.success(`   Generated ${full_name}`)
    }

    function get_type_migration_name(migration_type){
        switch(migration_type) {
            case 'ct':
                return 'create-table'
                break
            case 'adc':
                return 'add-column'
                break
            default:
                break
        }
    }

    function verify_multiple_type(migration_type){
        let split_type = migration_type.split(',')
        if (split_type.length > 0){
            return true
        }
        return false
    }

    async function createMigration(params, migration_type) {
        if(migration_type === null) {
            migration_type = 'ct'
        }

        let is_multiple_type = verify_multiple_type(migration_type)


        let config_file = await load_config_file()
        var date_time = dateTime.create().format('Y-m-d-HMS')

        let type_migration_name = get_type_migration_name(migration_type)

        let full_name = `${date_time}-${type_migration_name}-${params}.xml`
        let full_dest = `src/main/resources/${config_file.liquibase.destination}/${full_name}`

        let props = {
            changeset_id: 1,
            table_name: params,
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

        switch(migration_type) {
            case 'ct':
                await generate('create-table.js.ejs', full_dest, props, full_name)
                break
            case 'adc':
                await generate('add-column.js.ejs', full_dest, props, full_name)
                break
            default:
                print.error('type ' + migration_type + ' not supported')
        }
    }

    toolbox.createMigration = createMigration
}
