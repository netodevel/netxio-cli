const fs = require('fs')

function createDir(destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true })
    }
}

async function createFile(file_path, file_value, prompt) {
    let file_name = file_path.split("/").pop();
    let result = ""
    if (fs.existsSync(file_path)) {
        result = await prompt.ask({
            type: 'input',
            name: 'name',
            message: 'File: ' + file_name + ' already exists you want overwrite?',
        });
    }

    if (result === "" || result.name === "y") {
        fs.writeFileSync(file_path, file_value)
    }

    return file_name;
}

module.exports = { createDir, createFile }