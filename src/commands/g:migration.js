const command = {
  name: 'g:migration',
  description: 'Create new Liquibase Migration',
  run: async toolbox => {
    const {
      parameters,
      createMigration,
    } = toolbox

    const params = parameters.first
    await createMigration(params)
  },
}
module.exports = command  