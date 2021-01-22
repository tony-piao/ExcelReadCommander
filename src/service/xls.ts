import XLSX, {Sheet} from 'xlsx'
import fs from 'fs'; //文件模块
import Path from 'path'; //系统路径模块
import {I18n} from '../types/i18n'

export class XlsClass {
  private xlsPath:string;

  constructor(path: string) {
    this.xlsPath = path;
  }

  getHeaderRow(sheet: Sheet) {
    const headers = []
    const range = XLSX.utils.decode_range(sheet['!ref'] as string)
    let C
    const R = range.s.r
    /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
      /* find the cell in the first row */
      let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
      headers.push(hdr)
    }
    return headers
  }

  readData() {
    const workbook = XLSX.readFile(this.xlsPath, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const results = XLSX.utils.sheet_to_json(worksheet)
    this.generateI18nFiles(results)
  }

  generateI18nFiles(results: any[]): void {
    const enData: I18n  = {};
    const zhData: I18n = {};

    results.forEach(element => {
      enData[element.KEY]= element.EN;
      zhData[element.KEY] = element.ZH;
    });

    this.writeJson('../../en.js', JSON.stringify(enData))
    this.writeJson('../../zh.js', JSON.stringify(zhData))
  }

  writeJson(path: string, content:string) {
    const targetFile = Path.join(__dirname, path);

    fs.writeFile(targetFile, content, function (err) {
      if (err) {
        //eslint-disable-next-line
        return console.error('error:' + err);
      }
        //eslint-disable-next-line
      console.log('文件创建成功，地址：' + targetFile);
    });

  }
}
