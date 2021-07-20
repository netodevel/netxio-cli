const command = {
  name: 'g:migration',
  description: 'Create new Liquibase Migration',
  run: async toolbox => {
    const {
      parameters,
      createMigration,
      print,
    } = toolbox

    const params = parameters.first
    const table_name = parameters.second

    if (params == null) {
      print.error('param[1] - migration_name can not be null ')
      return
    }

    if (table_name == null) {
      print.error('param[2] - table_name can not be null ')
      return
    }

    const migration_type = parameters.options.t
    await createMigration(params, migration_type, table_name)
  },
}
module.exports = command  
