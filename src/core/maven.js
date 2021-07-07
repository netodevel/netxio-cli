async function structureMaven(config_json) {
    let struct = {
        main_dir: 'src/main/java',
        test_dir: 'src/test/java'
    }

    let group_id = replaceAll(config_json.javaProjects.groupId, '.', '/')

    let full_path = `${process.cwd()}/${struct.main_dir}/${group_id}/${config_json.javaProjects.packageController}`
    let full_path_test = `${process.cwd()}/${struct.test_dir}/${group_id}/${config_json.javaProjects.packageController}`
    let response = {
        full_path_main: full_path,
        full_path_test: full_path_test,
        group_id: group_id
    }

    return response
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

module.exports = { structureMaven }