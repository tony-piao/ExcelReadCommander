import inquirer from 'inquirer';
import { XlsClass } from './service/xls';

inquirer.prompt([
  {
    type: 'Input',
    name: 'excelPath',
    message: '请输入要解析的excel地址[绝对地址]:'
  }
]).then((answers) => {
  const xlsService = new XlsClass(answers.excelPath)
  xlsService.readData()
})