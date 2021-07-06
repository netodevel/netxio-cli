const command = {
  name: 'g:model',
  run: async toolbox => {

    const { print, parameters } = toolbox
    const fs = require('fs')
    const mUpdate = require('./m:update.js')

    function attrsFromParameters(parameters) {
      let attributes = "";
      for (i = 0; i < parameters.array.length; i++) {
        if(i==0) continue;DefaultSchema
        let attrSplit = parameters.array[i].split(":")
        attributes += '\"' + attrSplit[0] + '\"' + ':' + '\"' + attrSplit[1] + '\"';
      }

      return attributes;
    }

    function jsonFromParameters(parameters) {
      let rootJson = '[{' + '\"' + parameters.first.toLowerCase() + '\"' + ':{' + attrsFromParameters(parameters) +'}}]'
      let objectJson = JSON.parse(rootJson);
      return JSON.stringify(objectJson, null, 2);
    }

    function loadModels() {
      let fileContents = fs.readFileSync('./models.json', 'utf8');
      return JSON.parse(fileContents);
    }

    function validateIfExistsModel(readJson, parameters, toolbox) {
      let isExists = readJson.some(e => e.hasOwnProperty(parameters.first.toLowerCase()));
      if (isExists) {
        print.error(`model ${parameters.first.toLowerCase()} already exists` )
        print.info(`If you want to change an existing model. Change the ${toolbox.print.colors.green('models.json')} and then run ${toolbox.print.colors.green('m:update')}`)
        return true;
      }
      return false;
    }

    let models = loadModels();
    if(validateIfExistsModel(models, parameters, toolbox)){
      return;
    }

    fs.writeFileSync('models.json', jsonFromParameters(parameters), 'utf8');
    
    print.success('create root/models.json')
    print.info('invoke models_update')
    mUpdate.run(toolbox)
  }
}

module.exports = command  
