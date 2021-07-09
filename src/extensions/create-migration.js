module.exports = (toolbox) => {
    const { print, parameters, prompt, filesystem, template } = toolbox
    var Pluralize = require('pluralize')
    var dateTime = require('node-datetime')

    async function load_config_file() {
        const config_file = filesystem.read('./nt.json', 'json')
        return config_file
    }

    async function createMigration(params) {
        let config_file = await load_config_file()
        var date_time = dateTime.create().format('Y-m-d-HMS')

        let full_name = `${date_time}-create-table-${params}`
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

        await template.generate({
            template: 'create-table.js.ejs',
            target: `${full_dest}`,
            props: props,
        })

        print.info('invoke liquibase')
        print.success(`   Generated ${full_name}`)
    }

    toolbox.createMigration = createMigration
}
