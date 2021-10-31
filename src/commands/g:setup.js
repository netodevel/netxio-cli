const command = {
  name: 'g:setup',
  description: 'Create nt.json to configure this cli',
  run: async toolbox => {
    const { parameters, generateSetup } = toolbox

    await generateSetup(parameters)
  }
}
module.exports = command
