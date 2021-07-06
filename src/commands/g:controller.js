const command = {
  name: 'g:controller',
  run: async toolbox => {
    const { print, parameters } = toolbox
    
    var Mustache = require('mustache');
    var Pluralize = require('pluralize')
    const yaml = require('js-yaml')
    const fs = require('fs');
    
    let fileContents = fs.readFileSync('./nt.yaml', 'utf8');
    let data = yaml.load(fileContents);

    let jsonString = JSON.stringify(data, null, 2);
    let json = JSON.parse(jsonString);

    let destination = replaceAll(json.javaProjects.groupId, '.', '/')
    let mavenStructure = "src/main/java/"
    let packageDest = json.javaProjects.packageController;
    let mavenTestStructure = "src/test/java/"

    var model =  {
      package_value: json.javaProjects.groupId + "." + json.javaProjects.packageController,
      class_name: toolbox.parameters.first + "Controller",
      class_name_test: toolbox.parameters.first + "ControllerTest",
      route: Pluralize.plural(toolbox.parameters.first.toLowerCase())
    };

    let fullDestinationMain = process.cwd() + "/" + mavenStructure + destination + "/" + packageDest;
    let fullDestinationTest = process.cwd() + "/" + mavenTestStructure + destination + "/" + packageDest;
    
    console.log(fullDestinationMain)
    console.log(fullDestinationTest)

    if (!fs.existsSync(fullDestinationMain)) {
      fs.mkdirSync(fullDestinationMain, { recursive: true })
    }

    if (!fs.existsSync(fullDestinationTest)) {
      fs.mkdirSync(fullDestinationTest, { recursive: true })
    }

    let templateController = fs.readFileSync('/home/jose-da-silva-neto/Documents/github-workspace/nt/src/templates/controller/spring/controller-blank.mustache', 'utf8');
    let templateTestController = fs.readFileSync('/home/jose-da-silva-neto/Documents/github-workspace/nt/src/templates/controller/spring/controller-test-blank.mustache', 'utf8');

    var output = Mustache.render(templateController, model);
    var outputTest = Mustache.render(templateTestController, model);

    fs.writeFileSync(fullDestinationMain + "/" + model.class_name + ".java", output);
    fs.writeFileSync(fullDestinationTest + "/" + model.class_name + "Test.java", outputTest);

    print.success('Controller generated')

    function replaceAll(string, search, replace) {
      return string.split(search).join(replace);
    }
  }

}
module.exports = command  