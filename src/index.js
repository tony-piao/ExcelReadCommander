const inquirer = require('inquirer')
const Xls = require('./service/xls')

inquirer.prompt([
  {
    type: 'Input',
    name: 'excelPath',
    message: '请输入要解析的excel地址'
  }
]).then((answers) => {
  const xlsService = new Xls(answers.excelPath)
  xlsService.readData()
})