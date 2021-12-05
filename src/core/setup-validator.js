async function ntIsConfigured (filesystem, print) {
  if (!filesystem.exists('nt.json')) {
    print.error('nt.json not found. run: nt g:setup')
    return false
  }

  return true
}

module.exports = { ntIsConfigured }
