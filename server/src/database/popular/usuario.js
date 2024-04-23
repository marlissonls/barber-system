import getConnection from "../index.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function register() {
    //const { nome, telefone, email, senha } = req.body

    const nome = 'José André';
    const telefone = '11999541278';
    const email = 'jose@andre.com';
    const senha = '123456';

    const hash = await bcrypt.hash(senha, 10);

    const query = 'INSERT INTO usuarios (nome, telefone, email, senha) VALUES (?, ?, ?, ?)';
    const params = [nome, telefone, email, hash];

    const db = await getConnection();
    try {
        
        db.run(query, params);
        await db.close();

        console.log('Usuário cadastrado.')
    } catch (err) {
        console.log('FALHOU')
        console.error(err.message);
        await db.close();
    }
}

async function login() {
    //const { identificador, senha } = req.body;
    const identificador = '11978541263'
    const senha = '1234567'

    try {
        const db = await getConnection();

        const isEmail = identificador.includes('@');

        let query;
        let params;

        if (isEmail) {
            query = 'SELECT * FROM usuarios WHERE email = ?';
            params = [identificador];
        } else {
            query = 'SELECT * FROM usuarios WHERE telefone = ?';
            params = [identificador];
        }

        const usuario = await db.get(query, params);
        
        if (!usuario) {
            console.log('Credencial errada')
            return 
            //res.status(400).json({ error: 'Credenciais inválidas' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            console.log('Senha errada')
            return 
            //res.status(400).json({ error: 'Credenciais inválidas' });
        }
        
        delete usuario.senha;

        const token = jwt.sign({ userId: usuario.id, nome: usuario.nome, email: usuario.email, telefone: usuario.telefone, tipo: usuario.tipo }, 'SEU_SECRET_KEY', { expiresIn: '480h' });

        //res.status(200).json({ message: 'Login bem-sucedido', usuario, token });
        console.log({ message: 'Login bem-sucedido', usuario, token });

        await db.close();
    } catch (err) {
        console.error(err);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function get() {
    const userId = 2;

    try {
        const db = await getConnection();

        const query = 'SELECT * FROM usuarios WHERE id = ?';
        const params = [userId];

        const usuario = await db.get(query, params);
        await db.close();

        if (!usuario) {
            return console.log('Não encontrado');
            //res.status(404).json({ error: 'Usuário não encontrado' });
        }

        delete usuario.senha;

        console.log(usuario);
    } catch (err) {
        await db.close();
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

async function update() {
    const userId = 1;
    let nome //= 'José André Marques';
    let telefone //= '11999541278';
    let email //= 'jose@marques.com';
    let senha = '1234567';

    try {
        const db = await getConnection();

        const checkUserQuery = 'SELECT * FROM usuarios WHERE id = ?';
        const checkUserParams = [userId];
        const existingUser = await db.get(checkUserQuery, checkUserParams);

        if (!existingUser) {
            console.log('Usuario não existe')
            return 
            res.status(404).json({ error: 'Usuário não encontrado' });
        }

        let updateFields = '';
        const updateParams = [];

        if (nome) {
            updateFields += 'nome = ?, ';
            updateParams.push(nome);
        }

        if (telefone) {
            updateFields += 'telefone = ?, ';
            updateParams.push(telefone);
        }

        if (email) {
            updateFields += 'email = ?, ';
            updateParams.push(email);
        }

        if (senha) {
            const hash = await bcrypt.hash(senha, 10);
            updateFields += 'senha = ?, ';
            updateParams.push(hash);
        }

        updateFields = updateFields.slice(0, -2);

        const updateQuery = `UPDATE usuarios SET ${updateFields} WHERE id = ?`;
        updateParams.push(userId);

        await db.run(updateQuery, updateParams);
        await db.close();

        console.log({ message: 'Usuário atualizado com sucesso!' })
        //res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
        await db.close();
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
};


// register()
// login()
// get()
// update()