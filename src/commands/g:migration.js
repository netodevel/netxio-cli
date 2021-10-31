const command = {
  name: 'g:migration',
  description: 'Create new Liquibase Migration',
  run: async toolbox => {
    const { parameters, createMigration, print } = toolbox

    const params = parameters.first
    const tableName = parameters.second

    if (params == null) {
      print.error('param[1] - migration_name can not be null ')
      return
    }

    if (tableName == null) {
      print.error('param[2] - tableName can not be null ')
      return
    }

    const migrationType = parameters.options.t
    await createMigration(params, migrationType, tableName)
  }
}
module.exports = command
