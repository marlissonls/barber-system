import getConnection from "../index.js";

async function register(req, res) {
    //const { usuario_id, cadeira_id, servico_id, data, hora } = req.body;
    const usuario_id = 2
    const cadeira_id = 2
    const servico_id = 3
    const data = new Date().getTime()
    const hora = 10

    const db = await getConnection();
    try {
        const query = 'INSERT INTO agendamentos (usuario_id, cadeira_id, servico_id, data, hora) VALUES (?, ?, ?, ?, ?)';
        const params = [usuario_id, cadeira_id, servico_id, data, hora];

        db.run(query, params);
        await db.close();

        console.log('Agenda realizada.')
        return //res.status(200).json({ message: 'Agendamento realizado!' });
    } catch(err) {
        await db.close();
        console.error(err.message);
        return //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function get(req, res) {
    // const userId = req.params.userId;
    const userId = 2

    const query = `
        SELECT agendamentos.id, usuarios.nome AS nome_usuario, cadeiras.nome AS nome_cadeira, servicos.id AS id_servico, servicos.nome AS nome_servico, servicos.preco AS preco_servico
        FROM agendamentos
        INNER JOIN usuarios ON agendamentos.cadeira_id = usuarios.id
        INNER JOIN cadeiras ON agendamentos.cadeira_id = cadeiras.id
        INNER JOIN servicos ON agendamentos.servico_id = servicos.id
        WHERE agendamentos.usuario_id = ? AND agendamentos.status != "concluído"
    `;
    const params = [userId];

    const db = await getConnection();
    try {
        const agendamentos = await db.all(query, params);
        await db.close();

        if (!agendamentos.length) {
            console.log('Não há agendamentos.')
            return //res.status(404).json({ error: 'Nenhuma agenda pendente encontrada.' });
        }

        console.log({ agendamentos })
        return //res.status(200).json({ agenda });
    } catch (err) {
        await db.close();
        console.error(err.message);
        return //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function remove(req, res) {
    const id = req.params.id

    const db = await getConnection();
    try {
        const checkAgendamentoQuery = 'SELECT * FROM agendamentos WHERE id = ?';
        const checkAgendamentoParams = [id];
        const agendamento = await db.get(checkAgendamentoQuery, checkAgendamentoParams);

        if (!agendamento) {
            console.log('Esse agendamento não existe.')
            return //res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        const removeQuery = `DELETE FROM agendamentos WHERE id = ?`;
        const removeParams = [id];

        await db.run(removeQuery, removeParams);
        await db.close();

        console.log('Deletado')
        //res.status(200).json({ message: 'Agendamento deletado com sucesso!' });
    } catch (err) {
        await db.close();
        console.error(err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


// register()
get()
// remove()