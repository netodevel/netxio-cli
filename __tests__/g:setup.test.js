const { system, filesystem } = require('gluegun')

const src = filesystem.path(__dirname, '..')

const cli = async cmd =>
  system.run('node ' + filesystem.path(src, 'bin', 'nt') + ` ${cmd}`)

test('given nt g:setup should create nt.json', async () => {
  const pomValue = `
    <?xml version="1.0"?>
    <project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
        https://maven.apache.org/xsd/maven-4.0.0.xsd" 
        xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

      <modelVersion>4.0.0</modelVersion>
      <groupId>com.apptrato</groupId>
      <artifactId>crawler-orchestration-api</artifactId>
      <version>1.0.0-SNAPSHOT</version> 
    </project>
  `
  filesystem.write('pom.xml', pomValue)

  const output = await cli('g:setup')

  expect(output).toContain('Invoke nt:setup')
  expect(output).toContain('   Generated nt.json')

  const ntJson = filesystem.read('nt.json')

  expect(ntJson).toContain('javaProjects')
  expect(ntJson).toContain('liquibase')

  // cleanup artifact
  filesystem.remove('nt.json')
  filesystem.remove('pom.xml')
})

test('given nt g:setup outside of a maven project should return an error', async () => {
  const output = await cli('g:setup')
  expect(output).toContain(
    'pom.xml not found. you need to be inside a maven project'
  )
})
