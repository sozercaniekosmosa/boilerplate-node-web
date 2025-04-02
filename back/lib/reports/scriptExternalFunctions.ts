import pg from "pg";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {config} from "dotenv";
import glob from "../../../front/src/glob";
import {noSQL} from "../db/noSQL";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = config({override: true, path: __dirname + '\\.env'});
const {USER, HOST, DATABASE, PASSWORD, DB_PORT} = env.parsed

let useInnerData = null;
export const setInnerData = (data: any) => useInnerData = data;

export async function SQL(query: string) {

    if (useInnerData) {
        let res = null;
        [res, useInnerData] = [useInnerData, res];
        return res;
    }

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
        const queryResult = await client.query(query);

        // console.log(queryResult.rows);
        const arr = queryResult.rows;
        await client.end();

        return arr;
    } catch (error) {
        global.ERR("Failed to connect to DB");
        const db = glob.db as noSQL;
        let data = db.getByID('data');
        return data ? data : [[1, 2, 3]];
    }
}