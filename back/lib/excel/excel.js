import Excel from "exceljs";

// пример работы с документом загрузка, изменение и сохранение
const workbook = new Excel.Workbook();
await workbook.xlsx.readFile('template.xlsx');

let ws = workbook.getWorksheet(1);

ws.getCell('A1').value = 'Привет!'

await workbook.xlsx.writeFile('result.xlsx');
