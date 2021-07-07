module.exports = (toolbox) => {
    const { print, parameters, prompt, filesystem, template } = toolbox
    const { structureMaven } = require('../core/maven')
    var Pluralize = require('pluralize')

    async function load_config_file() {
        const config_file = filesystem.read('./nt.json', 'json')
        return config_file
    }

    async function ask_overwrite(src_main_destination) {
        let exists_file = toolbox.filesystem.exists(src_main_destination)
        if (exists_file) {
            let file_name = src_main_destination.split("/").pop()

            const result = await prompt.ask({
                type: 'input',
                name: 'name',
                message: 'File: ' + file_name + ' already exists you want overwrite?',
            });

            return result
        }
    }

    async function createController(class_name_param) {
        let config_file = await load_config_file()
        let destination = structureMaven(config_file)

        let props = {
            class_name: `${class_name_param}Controller`,
            class_name_test: `${class_name_param}ControllerTest`,
            package_value: config_file.javaProjects.groupId,
            route: Pluralize.plural(class_name_param.toLowerCase())
        }

        let src_main_destination = `${(await destination).full_path_main}/${props.class_name}`
        let awnser = await ask_overwrite(src_main_destination)

        if (awnser != null && awnser.name === "n") {
            print.info('Generated Skiped')
            return
        }

        await template.generate({
            template: 'controller-blank.js.ejs',
            target: `${src_main_destination}`,
            props: props,
        })

        print.info('invoke src_main')
        print.success(`   Generated ${config_file.javaProjects.packageController}/${props.class_name}`)


        await template.generate({
            template: 'controller-test-blank.js.ejs',
            target: `${(await destination).full_path_test}/${props.class_name_test}`,
            props: props,
        })
        print.info('invoke test_unit')
        print.success(`   Generated ${config_file.javaProjects.packageController}/${props.class_name_test}`)
    }

    toolbox.createController = createController
}
