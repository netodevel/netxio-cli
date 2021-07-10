const command = {
  name: 'g:migration',
  description: 'Create new Liquibase Migration',
  run: async toolbox => {
    const {
      parameters,
      createMigration,
    } = toolbox

    const params = parameters.first
    const migration_type = parameters.options.t

    await createMigration(params, migration_type)
  },
}
module.exports = command  
