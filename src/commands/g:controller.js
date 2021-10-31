const command = {
  name: 'g:controller',
  description: 'Create new controller',
  run: async toolbox => {
    const { parameters, createController, print } = toolbox

    const name = parameters.first
    if (name == null) {
      print.error('param[1] - controller name can not be null')
      return
    }

    const destinationPackage = parameters.second
    await createController(name, destinationPackage)
  }
}
module.exports = command
