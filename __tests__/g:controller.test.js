const { system, filesystem } = require('gluegun')

const src = filesystem.path(__dirname, '..')

const cli = async cmd =>
  system.run('node ' + filesystem.path(src, 'bin', 'nt') + ` ${cmd}`)

test('given g:controller without nt.json should return error', async () => {
  const output = await cli('g:controller User')
  expect(output).toContain('nt.json not found. run: nt g:setup')
})
