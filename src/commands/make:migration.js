const command = {
  name: 'make:migration',
  description: 'Create migration from models',
  run: async toolbox => {
    const { parameters, createMigration, print } = toolbox
    const { parse } = require('java-parser')
    const javaText = `
  public class HelloWorldExample{
    public static void main(String args[]){
      System.out.println("Hello World !");
    }
  }
  `

    const cst = parse(javaText)

    print.success('make migrations')
  }
}
module.exports = command
