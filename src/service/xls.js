const XLSX = require('xlsx');
const fs = require('fs'); //文件模块
const Path = require('path'); //系统路径模块

class XlsClass {
  constructor(path) {
    this.xlsPath = path;
  }

  getHeaderRow(sheet) {
    const headers = []
    const range = XLSX.utils.decode_range(sheet['!ref'])
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
    console.log('result', results)
    this.generateI18nFiles(results)
  }

  generateI18nFiles(results) {
    const enData  = {};
    const zhData = {};

    results.forEach(element => {
      enData[element.KEY]= element.EN;
      zhData[element.KEY] = element.ZH;
    });

    this.writeJson('../../en.js', JSON.stringify(enData))
    this.writeJson('../../zh.js', JSON.stringify(zhData))
  }

  writeJson(path, content) {
    const targetFile = Path.join(__dirname, path);

    fs.writeFile(targetFile, content, function (err) {
      if (err) {
        return console.error('error:' + err);
      }
      console.log('文件创建成功，地址：' + targetFile);
    });

  }
}

module.exports = XlsClass