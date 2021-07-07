const fs = require('fs')

function exists_file(file_path) {
    return fs.existsSync(file_path)
}

module.exports = { exists_file }