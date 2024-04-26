import getConnection from "../../database/index.js";

export async function cadeira(db) {
    await db.exec(`
        ALTER TABLE cadeiras ADD folga INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora8 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora9 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora10 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora11 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora12 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora13 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora14 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora15 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora16 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora17 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora18 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora19 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora20 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora21 INTEGER DEFAULT 0;
    `);
}

export async function cadeira2(db) {
    await db.exec(`
        ALTER TABLE cadeiras ADD hora22 INTEGER DEFAULT 0;
        ALTER TABLE cadeiras ADD hora23 INTEGER DEFAULT 0;
    `);
}

export async function cadeira3(db) {
    await db.exec(`
        ALTER TABLE cadeiras ADD usuario_id INTEGER DEFAULT 0;
    `);
}

const dbPath = process.cwd()+'/src/database/db/data.db';
const db = await getConnection(dbPath);
await cadeira3(db);
await db.close();

