import pg from "pg";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {config} from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = config({override: true, path: __dirname + '\\.env'});
const {USER, HOST, DATABASE, PASSWORD, DB_PORT} = env.parsed

export async function SQL(query: string) {

    try {
        const {Client} = pg;
        const client = new Client({
            user: USER,
            host: HOST,
            database: DATABASE,
            password: PASSWORD,
            port: +DB_PORT,
        });

        await client.connect();

        // `SELECT "reportDate", sumvol, summas, dens, densbik, temp, tempbik, press, pressbik FROM public."SIKNreports"`
        // `SELECT "recordNumber", "recordDate", "reportDate", "reportType", volline1, masline1, volline2, masline2, volline3, masline3, sumvol, summas, dens, densbik, volday, masday, temp, tempbik, press, pressbik, ratebik, maswithoutwater, watervol, massnetto, "reportNumber" FROM public."SIKNreports"`
        const queryResult = await client.query(query);

        // console.log(queryResult.rows);
        const arr = queryResult.rows;
        await client.end();

        return arr;
    } catch (error) {
        global.ERR("Failed to connect to DB");
        return [[1,2,3]];
    }
}