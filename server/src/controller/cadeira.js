import dotenv from 'dotenv';
import getConnection from '../database/index.js';

dotenv.config();

class CadeiraController {
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

    async getAll(req, res) {
        const db = await getConnection();
        try {
            const query = 'SELECT * FROM cadeiras';
    
            const cadeiras = await db.all(query);
            await db.close();
    
            if (!cadeiras.length) {
                return res.status(404).json({ error: 'Cadeiras não encontradas.' });
            }

            return res.status(200).json(cadeiras);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async getServicos(req, res) {
        const id = req.params.id

        const db = await getConnection();
        try {
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

        const query = `
            SELECT agendamentos.id, usuarios.nome AS nome_usuario, cadeiras.nome AS nome_cadeira, servicos.id AS id_servico, servicos.nome AS nome_servico, servicos.preco AS preco_servico
            FROM agendamentos
            INNER JOIN usuarios ON agendamentos.cadeira_id = usuarios.id
            INNER JOIN cadeiras ON agendamentos.cadeira_id = cadeiras.id
            INNER JOIN servicos ON agendamentos.servico_id = servicos.id
            WHERE agendamentos.usuario_id = ? AND agendamentos.status != "concluído"
        `;
        const params = [id];
    
        const db = await getConnection();
        try {
    
            
    
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

    async  update(req, res) {
        const id = req.params.id;
        const { nome, status } = req.body;

        const checkCadeiraQuery = 'SELECT * FROM cadeiras WHERE id = ?';
        const checkCadeiraParams = [id];

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
        
        const db = await getConnection();
        try {

            const cadeira = await db.get(checkCadeiraQuery, checkCadeiraParams);

            if (!cadeira) {
                return res.status(404).json({ error: 'Cadeira não encontrado' });
            }

            await db.run(updateQuery, updateParams);
            await db.close();

            res.status(200).json({ message: 'Cadeiras atualizado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    async remove(req, res) {
        const id = req.params.id

        const checkCadeiraQuery = 'SELECT * FROM cadeiras WHERE id = ?';
        const checkCadeiraParams = [id];

        const removeQuery = `DELETE FROM cadeiras WHERE id = ?`;
        const removeParams = [id];

        const db = await getConnection();
        try {
            const cadeira = await db.get(checkCadeiraQuery, checkCadeiraParams);
    
            if (!cadeira) {
                return res.status(404).json({ error: 'Cadeira inexistente' });
            }

            await db.run(removeQuery, removeParams);
            await db.close();

            res.status(200).json({ message: 'Cadeira deletado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default CadeiraController;