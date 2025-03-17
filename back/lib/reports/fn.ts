import pg, {QueryResult} from "pg";
import {addDay, addHour, formatDateTime, setDate} from "../time";
import {config} from "dotenv";
import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = config({override: true, path: __dirname + '\\.env'});
const {USER, HOST, DATABASE, PASSWORD, PORT,} = env.parsed


let arrData = [];
let queryResult: QueryResult<any>;

const round = (val, frc = 10) => Math.trunc(val * frc) / frc
export const list = async () => {

    let data;
    arrData = [];
    try {
        const {Client} = pg;
        const client = new Client({user: USER, host: HOST, database: DATABASE, password: PASSWORD, port: +PORT,});

        await client.connect();

        queryResult = await client.query(
            // `SELECT "reportDate", sumvol, summas, dens, densbik, temp, tempbik, press, pressbik FROM public."SIKNreports"`
            `SELECT "recordNumber", "recordDate", "reportDate", "reportType", volline1, masline1, volline2, masline2, volline3, masline3, sumvol, summas, dens, densbik, volday, masday, temp, tempbik, press, pressbik, ratebik, maswithoutwater, watervol, massnetto, "reportNumber" FROM public."SIKNreports"`
        );
        console.log(queryResult.rows);
        const arr = queryResult.rows;
        await client.end();

        let index = 1, _sumvol = 0, _summas = 0, _hours = setDate({hours: 0, minutes: 0});
        // @ts-ignore
        for (let i = 0; i < arr.length; i++) {
            const {reportDate, sumvol, summas, dens, densbik, temp, tempbik, press, pressbik} = arr[i];
            const date = formatDateTime(new Date(reportDate), 'dd.mm.yyyy')
            const time = formatDateTime(_hours, 'hh:MM');
            _hours = addHour(2, _hours);
            const timeTo = formatDateTime(_hours, 'hh:MM');
            const line = [
                index,
                date, time, timeTo,
                _sumvol, sumvol,
                _summas, summas,
                sumvol - _sumvol,
                summas - _summas,
                round(temp), round(tempbik),
                round(press, 100), round(pressbik, 100),
                round(dens), round(densbik),
            ];
            _sumvol = sumvol;
            _summas = summas;

            if (time == '10:00' && timeTo == '12:00') arrData.push([++index, date, '00:00', timeTo, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]);

            arrData.push(line);

            index++;
        }

    } catch (error) {
        console.error("Connection error", error.stack);
        return null;
    }
    return arrData;
}

export const sum = () => {
    // return [[data.reduce((acc, [a, b, c]) => acc + a, 0)]]
    return [[987]]
}