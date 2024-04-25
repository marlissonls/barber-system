import dotenv from 'dotenv';
import getConnection from '../database/index.js';

dotenv.config();

class AgendamentoController {
    async register(req, res) {
        const { usuario_id, cadeira_id, servico_id, data, hora } = req.body;
    
        const usuarioAgendamentosQuery = 'SELECT * FROM agendamentos WHERE usuario_id = ?';
        const usuarioAgendamentosParams = [usuario_id];
        
        const agendamentoQuery = 'INSERT INTO agendamentos (usuario_id, cadeira_id, servico_id, data, hora) VALUES (?, ?, ?, ?, ?)';
        const agendamentoParams = [usuario_id, cadeira_id, servico_id, data, hora];
    
        const db = await getConnection();
        try {
            const usuarioAgendamentos = await db.all(usuarioAgendamentosQuery, usuarioAgendamentosParams);
            
            const agendamentoExistente = usuarioAgendamentos.some(agendamento => agendamento.data === data && agendamento.hora === hora);
            if (agendamentoExistente) return res.status(200).json({ status: false, message: 'Você já agendou neste horário hoje.' });
    
            db.run(agendamentoQuery, agendamentoParams);
            await db.close();
    
            return res.status(200).json({ status: true, message: 'Agendamento realizado!' });
        } catch(err) {
            await db.close();
            console.error(err.message);
            return res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
        }
    }

    async usuarioAgendamentos(req, res) {
        const userId = req.params.userId;

        const query = `
            SELECT agendamentos.id, cadeiras.nome AS nome_cadeira, servicos.nome AS nome_servico, servicos.preco AS preco_servico
            FROM agendamentos
            INNER JOIN cadeiras ON agendamentos.cadeira_id = cadeiras.id
            INNER JOIN servicos ON agendamentos.servico_id = servicos.id
            WHERE agendamentos.usuario_id = ? AND agendamentos.status != "concluído"
        `;
        const params = [userId];
    
        const db = await getConnection();
        try {
            const agenda = await db.all(query, params);
            await db.close();
    
            if (!agenda.length) {
                return res.status(404).json({ error: 'Nenhuma agenda pendente encontrada.' });
            }
    
            return res.status(200).json({ agenda });
        } catch (err) {
            await db.close();
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async cadeiraAgendamentos(req, res) {
        const id = req.params.cadeiraId;

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
    
            return res.status(200).json(agenda);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async remove(req, res) {
        const id = req.params.id

        const db = await getConnection();
        try {
            const checkAgendamentoQuery = 'SELECT * FROM agendamentos WHERE id = ?';
            const checkAgendamentoParams = [id];
            const agendamento = await db.get(checkAgendamentoQuery, checkAgendamentoParams);
    
            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            const removeQuery = `DELETE FROM agendamentos WHERE id = ?`;
            const removeParams = [id];

            await db.run(removeQuery, removeParams);
            await db.close();

            res.status(200).json({ message: 'Agendamento deletado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default AgendamentoController;