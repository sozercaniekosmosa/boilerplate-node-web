import {PGlite} from "@electric-sql/pglite";

// PGlite - это PostgreSQL скомпилированный в WebAssembly и упакованный в простую TypeScript/JavaScript-библиотеку.
//
// Его ключевая фишка - отсутствие "линуксового" виртуального окружения, то есть вы не тянете за собой целый образ OS.
// В результате получаем:
// -- Минимальный размер — около 3 МБ в сжатом виде.
// -- Удобный API — просто импортируете библиотеку и вызываете методы для работы с базой.
//     Можно подключить вашу любимую ORMку типа Drizzle/TypeORM.
// -- Поддержку расширений — в поставку уже входят некоторые популярные плагины, вроде pgvector.
//
// Можно использовать PGlite как обычную in-memory базу (данные хранятся в памяти и пропадают при перезапуске),
// а можно включить постоянное хранение - IndexedDB в браузере или файловую систему в Node.js/Bun/Deno.

export const PGLiteExample = async (path) => {
    const db = new PGlite(path);
    await db.exec(`
      CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        task TEXT,
        done BOOLEAN DEFAULT false
      );
      INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
      INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
      INSERT INTO todo (task, done) VALUES ('Create a table', true);
      INSERT INTO todo (task, done) VALUES ('Insert some data', true);
      INSERT INTO todo (task) VALUES ('Update a task');
`)

    const ret = await db.query(` SELECT * from todo WHERE id = 1; `)
    console.log(ret.rows);
}