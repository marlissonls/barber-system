import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { promisify } from 'util';
import router from './router';
import getConnection from './database';
import { cadeira, servico, usuario, agendamento } from './schema';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

const fileExists = promisify(fs.exists);

const initializeDatabase = async () => {
    const dbPath = './database/db/data.db';

    const exists = await fileExists(dbPath);

    if (!exists) {
        const db = await getConnection(dbPath);

        await cadeira(db);
        await servico(db);
        await usuario(db);
        await agendamento(db);

        await db.close();
    }
};

const port = 3000;

initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}).catch(err => {
    console.error('Erro ao inicializar o banco de dados:', err);
});