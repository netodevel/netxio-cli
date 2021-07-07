const command = {
  name: 'g:controller',
  description: 'Create new controller',
  run: async toolbox => {
    const {
      parameters,
      createController,
    } = toolbox


    console.log(parameters)

    const name = parameters.first
    await createController(name)
  },
}
module.exports = command  