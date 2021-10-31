async function structureMaven(config_json, package) {
  let struct = {
    main_dir: 'src/main/java',
    test_dir: 'src/test/java'
  }

  let group_id = replaceAll(config_json.javaProjects.groupId, '.', '/')
  let package_destination = package_dest(
    package,
    config_json.javaProjects.packageController
  )

  let full_path = `${process.cwd()}/${
    struct.main_dir
  }/${group_id}/${package_destination}`
  let full_path_test = `${process.cwd()}/${
    struct.test_dir
  }/${group_id}/${package_destination}`
  let response = {
    full_path_main: full_path,
    full_path_test: full_path_test,
    group_id: group_id
  }

  return response
}

function package_dest(package, package_from_config) {
  if (package != null) {
    return replaceAll(package, '.', '/')
  }
  return replaceAll(package_from_config, '.', '/')
}

function replaceAll(string, search, replace) {
  return string.split(search).join(replace)
}

module.exports = { structureMaven }
