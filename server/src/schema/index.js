export async function cadeira(db) {
    await db.exec(`
        CREATE TABLE cadeiras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            status TEXT DEFAULT 'livre' NOT NULL
        )
    `);
}

export async function servico(db) {
    await db.exec(`
        CREATE TABLE servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cadeira_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            preco REAL NOT NULL
        )
    `);
}

export async function usuario(db) {
    await db.exec(`
        CREATE TABLE usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            senha TEXT NOT NULL,
            tipo TEXT DEFAULT 'cliente'
        )
    `);
}

export async function agendamento(db) {
    await db.exec(`
        CREATE TABLE agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            cadeira_id INTEGER NOT NULL,
            servico_id INTEGER NOT NULL,
            data INTEGER NOT NULL,
            hora INTEGER NOT NULL,
            status TEXT DEFAULT 'pendente'
        )
    `);
}
