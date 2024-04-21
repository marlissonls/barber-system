export async function cadeira(db) {
    await db.exec('CREATE TABLE cadeiras (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, status TEXT)')
}

export async function servico(db) {
    await db.exec('CREATE TABLE servicos (id INTEGER PRIMARY KEY AUTOINCREMENT, cadeira_id INTEGER, name TEXT, preco REAL)')
}

export async function usuario(db) {
    await db.exec('CREATE TABLE usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, telefone TEXT, email TEXT, senha TEXT)')
}

export async function agendamento(db) {
    await db.exec('CREATE TABLE agendamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, servico_id INTEGER, cadeira_id INTEGER, usuario_id INTEGER, data INTEGER, hora INTEGER)')
}