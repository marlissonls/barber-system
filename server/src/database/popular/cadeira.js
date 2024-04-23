import getConnection from "../index.js";

async function register() {
    const nome = 'Cadeira 3'

    const db = await getConnection();
    try {
        const query = 'INSERT INTO cadeiras (nome) VALUES (?)';
        const params = [nome];

        db.run(query, params);
        await db.close();

        console.log('Cadeira registrada')
        //res.status(200).json({ message: 'Cadeira Registrada.' });
    } catch (err) {
        await db.close();
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function getAll() {
    const db = await getConnection();
    try {
        const query = 'SELECT * FROM cadeiras';

        const cadeiras = await db.all(query);
        await db.close();

        if (!cadeiras.length) {
            console.log('Sem cadeira')
            //return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        console.log(cadeiras)
        //res.status(200).json(cadeiras);
    } catch (err) {
        await db.close();
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

async function getServicos() {
    const id = 1

    const queryCadeiraInfo = 'SELECT * FROM cadeiras WHERE id = ?';
    const queryServicos = 'SELECT * FROM servicos WHERE cadeira_id = ?';
    const paramsCadeiraInfo = [id]

    const db = await getConnection();
    try {
        const cadeira = await db.get(queryCadeiraInfo, paramsCadeiraInfo);

        if (!cadeira) {
            console.log('sem cadeira')
            return //res.status(404).json({ error: 'Cadeira não encontrada.' });
        }

        const servicos = await db.all(queryServicos, paramsCadeiraInfo);
        await db.close();

        if (!servicos.length) {
            console.log('sem servico')
            return //res.status(404).json({ error: 'Serviços não encontrados.' });
        }

        console.log({cadeira: cadeira, servicos: servicos})
        return //res.status(200).json({cadeira: cadeira, servicos: servicos});
    } catch (err) {
        await db.close();
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function agendamentos(req, res) {
    // const id = req.params.id;
    const id = 2

    const query = `
        SELECT agendamentos.id, usuarios.nome AS nome_usuario, cadeiras.nome AS nome_cadeira, servicos.id AS id_servico, servicos.nome AS nome_servico, servicos.preco AS preco_servico
        FROM agendamentos
        INNER JOIN usuarios ON agendamentos.cadeira_id = usuarios.id
        INNER JOIN cadeiras ON agendamentos.cadeira_id = cadeiras.id
        INNER JOIN servicos ON agendamentos.servico_id = servicos.id
        WHERE agendamentos.cadeira_id = ? AND agendamentos.status != "concluído"
    `;
    const params = [id];

    const db = await getConnection();
    try {
        const agenda = await db.all(query, params);
        await db.close();

        if (!agenda.length) {
            return //res.status(404).json({ error: 'Nenhuma agenda pendente encontrada.' });
        }

        console.log({agenda})
        return //res.status(200).json(agenda);
    } catch (err) {
        await db.close();
        console.error(err.message);
        return //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function update() {
    //const id = req.params.id;
    //const { nome, status } = req.body;
    const id = '1'
    const nome = 'cadeira 1 Preferencial'
    const status = 'ocupado'

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
            console.log('Cadeira não encontrada.')
            //return res.status(404).json({ error: 'Cadeira não encontrado' });
        }

        await db.run(updateQuery, updateParams);
        await db.close();

        console.log('Atualizado')
        //res.status(200).json({ message: 'Cadeiras atualizado com sucesso!' });
    } catch (err) {
        await db.close();
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

async function remove() {
    const id = 3

    const checkCadeiraQuery = 'SELECT * FROM cadeiras WHERE id = ?';
    const checkCadeiraParams = [id];

    const removeQuery = `DELETE FROM cadeiras WHERE id = ?`;
    const removeParams = [id];

    const db = await getConnection();
    try {
        const cadeira = await db.get(checkCadeiraQuery, checkCadeiraParams);

        if (!cadeira) {
            console.log('Não tem essa cadeira.')
            return //res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await db.run(removeQuery, removeParams);
        await db.close();

        console.log('Deletado')
        //res.status(200).json({ message: 'Cadeira deletado com sucesso!' });
    } catch (err) {
        await db.close();
        console.error(err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


// register()
// getAll()
// getServicos()
agendamentos()
// update()
// remove()