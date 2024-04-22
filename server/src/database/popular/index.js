import getConnection from "../index.js";

async function register() {
    const nome = 'Cadeira 4'

    try {
        const db = await getConnection();

        const query = 'INSERT INTO cadeiras (nome) VALUES (?)';
        const params = [nome];

        db.run(query, params, function(err) {
            console.log(params)
            if (err) {
                console.error(err.message);
                //return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            console.log(`Serviço registrado com ID: ${this.lastID}`);
            //res.status(200).json({ message: 'Cadeira registrada.' });
        });

        await db.close();
    } catch (err) {
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


async function getAll() {    
    try {
        const db = await getConnection();

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
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
};


async function getCadeiraServico() {
    const id = 1

    try {
        const db = await getConnection();

        const queryCadeiraInfo = 'SELECT * FROM cadeiras WHERE id = ?';
        const paramsCadeiraInfo = [id]

        const cadeira = await db.get(queryCadeiraInfo, paramsCadeiraInfo);

        if (!cadeira) {
            console.log('ERRO MEU CARO')
            //return res.status(404).json({ error: 'Cadeira não encontrada.' });
        }

        const queryServicos = 'SELECT * FROM servicos WHERE cadeira_id = ?';

        const servicos = await db.all(queryServicos, paramsCadeiraInfo);

        if (!servicos.length) {
            console.log('ERRO MEU CARO')
            //return res.status(404).json({ error: 'Serviços não encontrados.' });
        }

        await db.close();
        console.log({cadeira: cadeira, servicos: servicos})
        //res.status(200).json({cadeira: cadeira, servicos: servicos});
    } catch (err) {
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


async function registerServico(req, res) {
    const cadeira_id = 1
    const nome = "Corte social"
    const preco = 15

    try {
        const db = await getConnection();

        const query = 'INSERT INTO servicos (cadeira_id, nome, preco) VALUES (?, ?, ?)';
        const params = [cadeira_id, nome, preco];

        db.run(query, params, function(err) {
            if (err) {
                console.error(err.message);
                //return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            //console.log(`Serviço registrado com ID: ${this.lastID}`);
            //res.status(200).json({ message: 'Serviço registrado.' });
        });
        console.log('servico registrado')
        await db.close();
    } catch (err) {
        console.error(err.message);
        //res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

//registerServico()
getCadeiraServico()

// register()
// getAll()
