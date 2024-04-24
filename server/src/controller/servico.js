import dotenv from 'dotenv';
import getConnection from '../database/index.js';

dotenv.config();

class ServicoController {
    async register(req, res) {
        const { cadeira_id, nome, preco } = req.body;
    
        const db = await getConnection();
        try {
            const query = 'INSERT INTO servicos (cadeira_id, nome, preco) VALUES (?, ?, ?)';
            const params = [cadeira_id, nome, preco];
    
            db.run(query, params);
            await db.close();

            console.log(`Serviço registrado.`);
            res.status(200).json({ status: true, message: 'Serviço registrado.' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
        }
    }

    async get(req, res) {
        const id = req.params.id;
    
        const db = await getConnection();
        try {
            const query = 'SELECT * FROM servicos WHERE id = ?';
            const params = [id];
    
            const servico = await db.get(query, params);

            if (!servico) {
                return res.status(200).json({ status: false, message: 'Serviço inexistente.' });
            }

            const queryCadeira = 'SELECT nome FROM cadeiras WHERE id = ?';
            const cadeira_id = [servico.cadeira_id];

            const nome_cadeira = await db.get(queryCadeira, cadeira_id);
            await db.close();

            servico.nome_cadeira = nome_cadeira.nome
    
            return res.status(200).json(servico);
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
        }
    };

    async update(req, res) {
        const id = req.params.id;
        const { nome, preco } = req.body;

        const db = await getConnection();
        try {
            const checkServicoQuery = 'SELECT * FROM servicos WHERE id = ?';
            const checkServicoParams = [id];
            const existingServico = await db.get(checkServicoQuery, checkServicoParams);

            if (!existingServico) {
                return res.status(200).json({ status: false, message: 'Serviço não encontrado' });
            }

            let updateFields = '';
            const updateParams = [];

            if (nome) {
                updateFields += 'nome = ?, ';
                updateParams.push(nome);
            }

            if (preco) {
                updateFields += 'preco = ?, ';
                updateParams.push(preco);
            }

            updateFields = updateFields.slice(0, -2);

            const updateQuery = `UPDATE servicos SET ${updateFields} WHERE id = ?`;
            updateParams.push(id);

            await db.run(updateQuery, updateParams);
            await db.close();

            res.status(200).json({ message: 'Serviço atualizado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
        }
    };

    async remove(req, res) {
        const id = req.params.id

        const db = await getConnection();
        try {
            const checkServicoQuery = 'SELECT * FROM servicos WHERE id = ?';
            const checkServicoParams = [id];
            const existingServico = await db.get(checkServicoQuery, checkServicoParams);
    
            if (!existingServico) {
                return res.status(200).json({ status: false, message: 'Serviço não encontrado' });
            }

            const removeQuery = `DELETE FROM servicos WHERE id = ?`;
            const removeParams = [id];

            await db.run(removeQuery, removeParams);
            await db.close();

            res.status(200).json({ message: 'Serviço deletado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
        }
    }
}

export default ServicoController;