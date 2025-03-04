import parseXlsx from 'excel';
const d = await parseXlsx.default('exp.xlsx')
console.log(d)