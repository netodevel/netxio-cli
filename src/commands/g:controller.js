const command = {
  name: 'g:controller',
  run: async toolbox => {
    const { print, parameters, prompt } = toolbox

    var Mustache = require('mustache');
    var Pluralize = require('pluralize')

    const fs = require('fs'); //TODO: remover fs daqui
    const fileGenerator = require('../core/file-generator')
    const loadConf = require('../core/load-configuration')

    let json = loadConf.loadJsonFromYaml();

    //TODO: ver como abstrair informação de projeto maven
    let destination = replaceAll(json.javaProjects.groupId, '.', '/')
    let mavenStructure = "src/main/java/"
    let packageDest = json.javaProjects.packageController;
    let mavenTestStructure = "src/test/java/"

    var model = {
      package_value: json.javaProjects.groupId + "." + json.javaProjects.packageController,
      class_name: toolbox.parameters.first + "Controller",
      class_name_test: toolbox.parameters.first + "ControllerTest",
      route: Pluralize.plural(toolbox.parameters.first.toLowerCase())
    };

    let fullDestinationMain = process.cwd() + "/" + mavenStructure + destination + "/" + packageDest;
    let fullDestinationTest = process.cwd() + "/" + mavenTestStructure + destination + "/" + packageDest;

    fileGenerator.createDir(fullDestinationMain)
    fileGenerator.createDir(fullDestinationTest)

    //TODO: remover full path e remover fs
    //TODO: remover mustache 
    let templateController = fs.readFileSync('/home/jose-da-silva-neto/Desktop/github/nt/src/templates/controller/spring/controller-blank.mustache', 'utf8');
    let templateTestController = fs.readFileSync('/home/jose-da-silva-neto/Desktop/github/nt/src/templates/controller/spring/controller-test-blank.mustache', 'utf8');

    var output = Mustache.render(templateController, model);
    var outputTest = Mustache.render(templateTestController, model);

    var controllerFile = fullDestinationMain + "/" + model.class_name + ".java";
    var controllerTestFile = fullDestinationTest + "/" + model.class_name + "Test.java";


    fileGenerator.createFile(controllerFile, output, prompt).then((file) => {
      print.info('invoke src_main')
      print.success(`   Generated ${packageDest}/${file}`)
      fileGenerator.createFile(controllerTestFile, outputTest, prompt).then((file) => {
        print.info('invoke test_unit')
        print.success(`   Generated ${packageDest}/${file}`)
      })
    });

    //TODO: modularizar
    function replaceAll(string, search, replace) {
      return string.split(search).join(replace);
    }
  }

}
module.exports = command  