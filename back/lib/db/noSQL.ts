import fs, {promises as fsPromises} from "fs";
import _ from "lodash";
import PATH, {resolve} from "path";
import root from 'app-root-path'


const pathRoot = root.path;
const pathResolveRoot = (path) => path.startsWith('.') ? resolve(pathRoot, ...path.split(/\\|\//)) : path;

export class noSQL {

    #__id = 0;
    #base64Language = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    dumpFilePath: any;
    private db: any;
    debouncedDumpDatabase: any;

    constructor(dumpFilePath = './news_dump.json') {
        this.dumpFilePath = pathResolveRoot(dumpFilePath);

        const strDump = this.getDumpDatabaseSync()?.toString();
        if (!strDump) this.writeFileAsync(this.dumpFilePath, '{}')
        this.db = JSON.parse(strDump ? strDump : '{}');

        // Debounced function to dump database
        this.debouncedDumpDatabase = _.debounce(this.dumpDatabase.bind(this), 1000);
    }

    #toShortString = (value, language = this.#base64Language) => {
        const len = language.length;
        let acc = "";
        while (value > 0) {
            const index = value % len;
            acc += language.charAt(index);
            value /= len;
        }
        return acc.split('').reverse().join('').replace(/^0+/g, '');
    };
    generateUID = (pre = '') => pre + this.#toShortString((new Date().getTime() + Math.ceil(Math.random() * 100) + (this.#__id++)))

    // Add an item
    add(id, data) {
        if (this.db[id]) return
        data.id = id;
        this.db[id] = data;
        this.debouncedDumpDatabase();
        return data;
    }

    // free an item
    free() {
        this.db = {};
        this.debouncedDumpDatabase();
    }

    // free an item
    del(id) {
        delete this.db[id];
        this.debouncedDumpDatabase();
        return id;
    }

    // get a news item by ID
    getByID = (id) => this.db[id];

    /**
     * Update a news item by ID
     * @param props may be object of [object] !!!must have id-prop
     */
    update(props) {

        if (!Array.isArray(props)) props = [props];

        for (let i = 0; i < props.length; i++) {
            const uf = props[i];
            const data = this.db[uf.id] ?? {};
            if (!data) throw new Error(`News with ID ${uf.id} not found.`);

            this.db[uf.id] = {...data, ...uf};
            this.debouncedDumpDatabase();
        }

    }

    // Get filter items
    getAll(clbFilter) {
        const arrVal = Object.values(this.db);
        const newsList = [];

        if (!clbFilter) return arrVal;

        for (let i = 0; i < arrVal.length; i++) {
            const val = arrVal[i];
            if (clbFilter(val)) {
                newsList.push(val);
            }
        }

        return newsList;
    }

    // Dump database to a file
    getDumpDatabaseSync = () => {
        try {
            return fs.readFileSync(this.dumpFilePath);
        } catch (e) {
            return null;
        }
    }
    getDumpDatabaseAsync = async () => await this.readFileAsync(this.dumpFilePath);

    async dumpDatabase() {
        await this.writeFileAsync(this.dumpFilePath, JSON.stringify(this.db, null, 2));
        console.log('Database dumped to file:', this.dumpFilePath);
    }

    readFileAsync = async (path, options?) => {
        try {
            const data = await fsPromises.readFile(path, options);
            return data;
        } catch (err) {
            throw 'Ошибка чтения файла: ' + path
        }
    };

    writeFileAsync = async (filePath, data) => {
        try {

            const dir = PATH.dirname(filePath)

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {recursive: true});
            }
            await fsPromises.writeFile(filePath, data);
        } catch (err) {
            throw 'Ошибка записи файла: ' + filePath
        }
    };
}

// Пример использования
// (async () => {
//
//     const db = new noSQL('./db.json'); //файл
//
//     if (!db.getByID('tags')) {//проверяем есть id
//         db.add('tags', {arr: [1, 2, 3], someData: 'привет!!!'}) //создаем
//     } else {
//         db.update({id: 'tags', arr: [2, 5, 6]}) //обновляем
//     }
//
//     // getAll - запрос с условием
//     const from = Date.now(), to = Date.now() + 36e5; //1-час
//     const arrResult = db.getAll((item) => {//условие формируется функцией
//         const {id, date} = item; // берем id, date
//         return date >= +from && date <= +to; // если условие выполняется значит значение строки из базы поподает в выборку
//     });
//     console.log(arrResult)
//
// })();
