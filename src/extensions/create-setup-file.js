module.exports = toolbox => {
  const { print, filesystem, template } = toolbox
  var pomParser = require('pom-parser')

  async function generateSetup (parameters) {
    if (!filesystem.exists('pom.xml')) {
      print.error('You need to run this command inside a maven project.')
    }

    var opts = {
      filePath: process.cwd() + '/pom.xml'
    }

    pomParser.parse(opts, async function (err, pomResponse) {
      if (err) {
        console.log('ERROR: ' + err)
        process.exit(1)
      }

      let json_pom = JSON.stringify(pomResponse.pomObject)
      let json_obj = JSON.parse(json_pom)

      let props_to = {
        groupId: json_obj.project.groupid
      }

      await template.generate({
        template: 'nt-json.js.ejs',
        target: process.cwd() + '/nt.json',
        props: props_to
      })

      print.info('Invoke nt:setup')
      print.success(`   Generated nt.json`)
    })
  }

  toolbox.generateSetup = generateSetup
}
