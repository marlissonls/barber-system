import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import getConnection from '../database/index.js';

dotenv.config();

class UsuarioController {
    async register(req, res) {
        const { nome, telefone, email, senha } = req.body;
        const hash = await bcrypt.hash(senha, 10);
    
        const query = 'INSERT INTO usuarios (nome, telefone, email, senha, tipo) VALUES (?, ?, ?, ?)';
        const params = [nome, telefone, email, hash];
    
        const db = await getConnection();
        try {
            db.run(query, params);
            await db.close();
            
            console.log(`Usuário cadastrado.`);
            return res.status(200).json({ message: 'Usuário Cadastrado!' });  
        } catch (err) {
            await db.close();
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async login(req, res) {
        const { identificador, senha } = req.body;

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
    
        const db = await getConnection();
        try {
            const usuario = await db.get(query, params);
            await db.close();

            if (!usuario) {
                return res.status(400).json({ error: 'Credenciais inválidas' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(400).json({ error: 'Credenciais inválidas' });
            }

            delete usuario.senha;

            const token = jwt.sign({ userId: usuario.id, nome: usuario.nome, email: usuario.email, telefone: usuario.telefone, tipo: usuario.tipo }, 'SEU_SECRET_KEY', { expiresIn: '480h' });

            return res.status(200).json({ message: 'Login bem-sucedido', usuario, token });
        } catch (err) {
            await db.close();
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async get(req, res) {
        const userId = req.params.id;

        const query = 'SELECT * FROM usuarios WHERE id = ?';
        const params = [userId];
    
        const db = await getConnection();
        try {
            const usuario = await db.get(query, params);
            await db.close();
    
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            delete usuario.senha;

            return res.status(200).json({ usuario: usuario });
        } catch (err) {
            await db.close();
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async update(req, res) {
        const userId = req.params.id;
        const { nome, telefone, email, senha } = req.body;

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

        const db = await getConnection();
        try {

            const checkUserQuery = 'SELECT * FROM usuarios WHERE id = ?';
            const checkUserParams = [userId];
            const existingUser = await db.get(checkUserQuery, checkUserParams);

            if (!existingUser) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const updateQuery = `UPDATE usuarios SET ${updateFields} WHERE id = ?`;
            updateParams.push(userId);

            await db.run(updateQuery, updateParams);
            await db.close();

            return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async remove(req, res) {
        const id = req.params.id

        try {
            const checkUserQuery = 'SELECT * FROM usuarios WHERE id = ?';
            const checkUserParams = [userId];
            const existingUser = await db.get(checkUserQuery, checkUserParams);

            if (!existingUser) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const removeQuery = `DELETE FROM usuarios WHERE id = ?`;
            const removeParams = [id];

            await db.run(removeQuery, removeParams);
            await db.close();

            return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default UsuarioController;