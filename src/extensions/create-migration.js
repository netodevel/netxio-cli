module.exports = (toolbox) => {
    const { print, parameters, prompt, filesystem, template } = toolbox
    var Pluralize = require('pluralize')
    var dateTime = require('node-datetime')

    async function load_config_file() {
        const config_file = filesystem.read('./nt.json', 'json')
        return config_file
    }

    async function generate(template_name, model) {
        await template.generate({
            template: template_name, 
            target: model.full_dest, 
            props: model.props,
        })

        print.info('invoke liquibase')
        print.success(`   Generated ${model.full_name}`)
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
                return ''
                break
        }
    }

    function verify_multiple_type(migration_type){
        let split_type = migration_type.split(',')
        if (split_type.length > 1){
            return true
        }
        return false
    }

    async function model_to_generate(params, migration_type, config_file, table_name){
        var date_time = dateTime.create().format('Y-m-d-HMS')
        let type_migration_name = get_type_migration_name(migration_type)
        let full_name = `${date_time}-${params}.xml`
        let full_dest = `src/main/resources/${config_file.liquibase.destination}/${full_name}`

        let props = {
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

        let model = {
            date_time: date_time,
            type_migration_name: type_migration_name,
            full_name: full_name,
            full_dest: full_dest,
            props: props
        }

        return model
    }

    async function execute_multiple_type(params, migration_type, config_file, table_name) {
        let model = await model_to_generate(params, migration_type, config_file, table_name)

        let split = migration_type.split(',')
        let types = []

        for (i = 0; i < split.length; i ++) {
            types.push(split[i])
        }

        let new_props = model["props"]
        new_props['types'] = types
        model['props'] = new_props

        await generate('multiple-types.js.ejs', model) 
    }

    async function execute_single_type(params, migration_type, config_file, table_name){
        if(migration_type === null) {
            migration_type = 'ct'
        }
       
        let model = await model_to_generate(params, migration_type, config_file, table_name)

        switch(migration_type) {
            case 'ct':
                await generate('create-table.js.ejs', model)
                break
            case 'adc':
                await generate('add-column.js.ejs', model) 
                break
            default:
                print.error('type ' + migration_type + ' not supported')
        }
    }

    async function createMigration(params, migration_type, table_name) {
        let is_multiple_type = verify_multiple_type(migration_type)
        let config_file = await load_config_file()

        if(is_multiple_type) {
            execute_multiple_type(params, migration_type, config_file, table_name)
        } else {
            execute_single_type(params, migration_type, config_file, table_name)
        }
    }

    toolbox.createMigration = createMigration
}
