import {saveUnitArrayAsFile} from "../fs.ts";

export const createExcelFile = async () => {
    // динамически импортируем
    await import( "./exceljs.min.js")

    // @ts-ignore
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);
    workbook.properties.date1904 = true;
    workbook.calcProperties.fullCalcOnLoad = true;
    workbook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
    ]
// const sheet = workbook.addWorksheet('My Sheet');
// create a sheet with red tab colour
    workbook.addWorksheet('My Sheet', {
        properties: {tabColor: {argb: 'ff00ff00'}}, //optional param
        views: [
            {showGridLines: false},//optional param
            {state: 'frozen', xSplit: 1, ySplit: 1}//optional param
        ],
        headerFooter: {firstHeader: "Hello Exceljs", firstFooter: "Hello World"},//optional param
        pageSetup: {paperSize: 9, orientation: 'landscape'}//optional param
    });


    let worksheet = workbook.getWorksheet(1);
    // Modify/Add individual cell
    let cell = worksheet.getCell('C1');
    cell.value = 'привет';

    const buffer = await workbook.xlsx.writeBuffer()
    // console.log(buffer)
    saveUnitArrayAsFile('test.xlsx', buffer)
}
