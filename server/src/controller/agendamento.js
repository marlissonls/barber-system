import dotenv from 'dotenv';
import getConnection from '../database/index.js';

dotenv.config();

class AgendamentoController {
    async register(req, res) {
        const { usuario_id, cadeira_id, servico_id, data, hora } = req.body;

        const agendamentosQuery = 'SELECT * FROM agendamentos';
        const agendamentoQuery = 'INSERT INTO agendamentos (usuario_id, cadeira_id, servico_id, data, hora) VALUES (?, ?, ?, ?, ?)';
        const agendamentoParams = [usuario_id, cadeira_id, servico_id, data, hora];
    
        const db = await getConnection();
        try {
            const agendamentos = await db.all(agendamentosQuery);
            
            const agendamentoExistente = agendamentos.some(agendamento => agendamento.data === data && agendamento.hora === hora);
            if (agendamentoExistente) return res.status(200).json({ status: false, message: 'Dia e horário indisponível.' });
    
            db.run(agendamentoQuery, agendamentoParams);
            await db.close();
    
            return res.status(200).json({ status: true, message: 'Agendamento realizado!' });
        } catch(err) {
            await db.close();
            console.error(err);
            return res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
        }
    }

    async usuarioAgendamentos(req, res) {
        const userId = req.params.userId;

        const query = `
            SELECT agendamentos.id, agendamentos.data, agendamentos.hora, cadeiras.nome AS nome_cadeira, servicos.nome AS nome_servico, servicos.preco AS preco_servico
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
    
            return res.status(200).json({ status: true, data: agenda });
        } catch (err) {
            await db.close();
            console.error(err.message);
            return res.status(200).json({ status: false, message: 'Falha ao buscar agendamentos' });
        }
    }

    async cadeiraAgendamentos(req, res) {
        const userId = req.params.userId;

        const getCadeiraQuery = 'SELECT * FROM cadeiras WHERE usuario_id = ?';
        const getCadeiraparams = [userId];

        const query = `
            SELECT agendamentos.id, agendamentos.data, agendamentos.hora, cadeiras.nome AS nome_cadeira, servicos.nome AS nome_servico, servicos.preco AS preco_servico, usuarios.nome AS nome_usuario
            FROM agendamentos
            INNER JOIN usuarios ON agendamentos.usuario_id = usuarios.id
            INNER JOIN cadeiras ON agendamentos.cadeira_id = cadeiras.id
            INNER JOIN servicos ON agendamentos.servico_id = servicos.id
            WHERE agendamentos.cadeira_id = ? AND agendamentos.status != "concluído"
        `;

        const db = await getConnection();
        try {
            const cadeira = await db.get(getCadeiraQuery, getCadeiraparams)
            if (!cadeira) return res.status(200).json({ status: false, message: 'Sem permissão.'})

            const params = [cadeira.id];
            const agenda = await db.all(query, params);
            await db.close();
    
            return res.status(200).json({ status: true, data: agenda });
        } catch (err) {
            console.error(err.message);
            return res.status(200).json({ status: false, message: 'Falha ao buscar agendamentos' });
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