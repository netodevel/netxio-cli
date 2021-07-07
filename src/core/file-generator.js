const fs = require('fs')

function createDir(destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true })
    }
}

function createFile(file_name, file_value, print) {
    fs.writeFileSync(file_name, file_value)
}

module.exports = { createDir, createFile }