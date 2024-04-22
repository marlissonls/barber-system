import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getConnection(path = process.cwd()+'/src/database/db/data.db') {
    const db = await open({
		filename: path,
		driver: sqlite3.Database
    });

    return db;
}

export default getConnection;