import parseXlsx from 'excel';

// пример работы с документом загрузка и вывод в консоль в виде массива
const d = await parseXlsx.default('template.xlsx')
console.log(d)