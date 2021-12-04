module.exports = toolbox => {
  const { print, filesystem, template } = toolbox
  const pomParser = require('pom-parser')

  async function generateSetup (parameters) {
    if (!filesystem.exists('pom.xml')) {
      print.error('pom.xml not found. you need to be inside a maven project')
      return
    }

    const opts = {
      filePath: process.cwd() + '/pom.xml'
    }

    pomParser.parse(opts, async function (err, pomResponse) {
      if (err) {
        print.error('ERROR: ' + err)
        process.exit(1)
      }

      const jsonPom = JSON.stringify(pomResponse.pomObject)
      const jsonObj = JSON.parse(jsonPom)

      const props = {
        groupId: jsonObj.project.groupid
      }

      await template.generate({
        template: 'nt-json.js.ejs',
        target: process.cwd() + '/nt.json',
        props: props
      })

      print.info('Invoke nt:setup')
      print.success('   Generated nt.json')
    })
  }

  toolbox.generateSetup = generateSetup
}
