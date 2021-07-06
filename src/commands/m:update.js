
const command = {
  name: 'm:update',
  run: async toolbox => {
    const { print, parameters } = toolbox
    print.success('updated models')
  }

}
module.exports = command  
