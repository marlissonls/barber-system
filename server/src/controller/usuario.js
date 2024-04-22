import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import getConnection from '../database/index.js';

dotenv.config();

class UsuarioController {
    async register(req, res) {
        const { nome, telefone, email, senha } = req.body;
    
        try {
            const db = await getConnection();
    
            const hash = await bcrypt.hash(senha, 10);
    
            const query = 'INSERT INTO usuarios (nome, telefone, email, senha) VALUES (?, ?, ?, ?)';
            const params = [nome, telefone, email, hash];
    
            db.run(query, params, function(err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }
    
                console.log(`Usuário cadastrado com ID: ${this.lastID}`);
                res.status(200).json({ message: 'Usuário Cadastrado!' });
            });
    
            await db.close();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async login(req, res) {
        const { identificador, senha } = req.body;
    
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
    
            db.get(query, params, async (err, row) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }
    
                if (!row) {
                    return res.status(400).json({ error: 'Credenciais inválidas' });
                }
    
                const senhaValida = await bcrypt.compare(senha, row.senha);
    
                if (!senhaValida) {
                    return res.status(400).json({ error: 'Credenciais inválidas' });
                }
    
                delete row.senha;
    
                const token = jwt.sign({ userId: row.id, nome: row.nome, email: row.email }, 'SEU_SECRET_KEY', { expiresIn: '1h' });
    
                res.status(200).json({ message: 'Login bem-sucedido', user: row, token });
            });
    
            await db.close();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async get(req, res) {
        const userId = req.params.id;
    
        try {
            const db = await getConnection();
    
            const query = 'SELECT * FROM usuarios WHERE id = ?';
            const params = [userId];
    
            const usuario = await db.get(query, params);
    
            await db.close();
    
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
    
            delete usuario.senha;
    
            res.status(200).json(usuario);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async update(req, res) {
        const userId = req.params.id;
        const { nome, telefone, email, senha } = req.body;

        try {
            const db = await getConnection();

            const checkUserQuery = 'SELECT * FROM usuarios WHERE id = ?';
            const checkUserParams = [userId];
            const existingUser = await db.get(checkUserQuery, checkUserParams);

            if (!existingUser) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
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

            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async agendamento(req, res) {
        const userId = req.params.id;
    
        try {
            const db = await getConnection();
    
            const query = `
                SELECT agendamentos.id, cadeira.nome AS nome_cadeira, servicos.nome AS nome_servico, servicos.preco AS preco_servico
                FROM agendamentos
                INNER JOIN cadeira ON agendamentos.cadeira_id = cadeiras.id
                INNER JOIN servicos ON agendamentos.servico_id = servicos.id
                WHERE agendamentos.usuario_id = ? AND agendamentos.status != "concluído"
            `;
    
            const params = [userId];
    
            const agenda = await db.all(query, params);
    
            await db.close();
    
            if (!agenda.length) {
                return res.status(404).json({ error: 'Nenhuma agenda pendente encontrada.' });
            }
    
            res.status(200).json(agenda);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    
}

export default UsuarioController;