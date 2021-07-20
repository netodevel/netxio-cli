const command = {
  name: 'g:migration',
  description: 'Create new Liquibase Migration',
  run: async toolbox => {
    const {
      parameters,
      createMigration,
    } = toolbox

    const params = parameters.first
    const table_name = parameters.second

    const migration_type = parameters.options.t
    await createMigration(params, migration_type, table_name)
  },
}
module.exports = command  
