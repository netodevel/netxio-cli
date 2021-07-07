const yaml = require('js-yaml')
const fs = require('fs')

function loadJsonFromYaml() {
    let yamlFile = fs.readFileSync('./nt.yaml', 'utf8')
    let data = yaml.load(yamlFile)

    let dataString = JSON.stringify(data, null, 2)
    return JSON.parse(dataString)
}

module.exports = { loadJsonFromYaml }
