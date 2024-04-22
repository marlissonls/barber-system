import dotenv from 'dotenv';
import getConnection from '../database/index.js';

dotenv.config();

class CadeiraController {
    async getAll(req, res) {
        try {
            const db = await getConnection();
    
            const query = 'SELECT * FROM cadeiras';
    
            const cadeiras = await db.all(query);
    
            await db.close();
    
            if (!cadeiras.length) {
                return res.status(404).json({ error: 'Cadeiras não encontradas.' });
            }

            res.status(200).json(cadeiras);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async get(req, res) {
        const id = req.params.id

        try {
            const db = await getConnection();
    
            const queryCadeiraInfo = 'SELECT * FROM cadeiras WHERE id = ?';
            const paramsCadeiraInfo = [id]

            const cadeira = await db.get(queryCadeiraInfo, paramsCadeiraInfo);
    
            if (!cadeira) {
                return res.status(404).json({ error: 'Cadeira não encontrada.' });
            }

            const queryServicos = 'SELECT * FROM servicos WHERE cadeira_id = ?';

            const servicos = await db.all(queryServicos, paramsCadeiraInfo);
    
            if (!servicos.length) {
                return res.status(404).json({ error: 'Serviços não encontrados.' });
            }

            await db.close();
            res.status(200).json({cadeira: cadeira, servicos: servicos});
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async agendamentos(req, res) {
        const id = req.params.id;
    
        try {
            const db = await getConnection();
    
            const query = `
                SELECT agendamentos.id, cadeiras.nome AS nome_cadeira, servicos.nome AS nome_servico, servicos.preco AS preco_servico
                FROM agendamentos
                INNER JOIN cadeiras ON agendamentos.cadeira_id = cadeiras.id
                INNER JOIN servicos ON agendamentos.servico_id = servicos.id
                WHERE agendamentos.usuario_id = ? AND agendamentos.status != "concluído"
            `;
    
            const params = [id];
    
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

    // async cadeira/:id

    // async cadeira/:id/servicos

    async register(req, res) {
        const { nome } = req.body;
    
        try {
            const db = await getConnection();
    
            const query = 'INSERT INTO cadeiras (nome) VALUES (?)';
            const params = [nome];
    
            db.run(query, params, function(err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }
    
                console.log(`Serviço registrado com ID: ${this.lastID}`);
                res.status(200).json({ message: 'Cadeira registrada.' });
            });
    
            await db.close();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async update(req, res) {
        const id = req.params.id;
        const { nome, status } = req.body;

        try {
            const db = await getConnection();

            const checkCadeiraQuery = 'SELECT * FROM cadeiras WHERE id = ?';
            const checkCadeiraParams = [id];
            const existingCadeira = await db.get(checkCadeiraQuery, checkCadeiraParams);

            if (!existingCadeira) {
                return res.status(404).json({ error: 'Cadeira não encontrado' });
            }

            let updateFields = '';
            const updateParams = [];

            if (nome) {
                updateFields += 'nome = ?, ';
                updateParams.push(nome);
            }

            if (status) {
                updateFields += 'status = ?, ';
                updateParams.push(status);
            }

            updateFields = updateFields.slice(0, -2);

            const updateQuery = `UPDATE cadeiras SET ${updateFields} WHERE id = ?`;
            updateParams.push(id);

            await db.run(updateQuery, updateParams);

            await db.close();

            res.status(200).json({ message: 'Cadeiras atualizado com sucesso!' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async remove(req, res) {
        const id = req.params.id

        try {
            const checkCadeiraQuery = 'SELECT * FROM cadeiras WHERE id = ?';
            const checkCadeiraParams = [id];
            const existingCadeira = await db.get(checkCadeiraQuery, checkCadeiraParams);
    
            if (!existingCadeira) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const removeQuery = `DELETE FROM cadeiras WHERE id = ?`;
            const removeParams = [id];

            await db.run(removeQuery, removeParams);

            await db.close();

            res.status(200).json({ message: 'Cadeira deletado com sucesso!' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default CadeiraController;