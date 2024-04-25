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
                    return res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
                }
    
                console.log(`Serviço registrado com ID: ${this.lastID}`);
                res.status(200).json({ status: true, message: 'Cadeira registrada.' });
            });
    
            await db.close();
        } catch (err) {
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação' });
        }
    }

    async getAll(req, res) {
        const query = 'SELECT * FROM cadeiras';

        const db = await getConnection();
        try {
            const cadeiras = await db.all(query);
            await db.close();

            return res.status(200).json(cadeiras);
        } catch (err) {
            console.error(err.message);
            return res.status(200).json({ status: true, message: 'Houve um erro na solicitação' });
        }
    };

    async getServicos(req, res) {
        const id = req.params.id

        const queryCadeiraInfo = 'SELECT * FROM cadeiras WHERE id = ?';
        const paramsCadeiraInfo = [id]
        const queryServicos = 'SELECT * FROM servicos WHERE cadeira_id = ?';
        const paramsServicos = [id]

        const db = await getConnection();
        try {
            const cadeira = await db.get(queryCadeiraInfo, paramsCadeiraInfo);
            if (!cadeira) {
                return res.status(200).json({ status: false, message: 'Cadeira não encontrada.' });
            }

            const servicos = await db.all(queryServicos, paramsServicos);
            await db.close();

            res.status(200).json({cadeira: cadeira, servicos: servicos});
        } catch (err) {
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação' });
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
                return res.status(200).json({ status: false, message: 'Cadeira não encontrada.' });
            }

            await db.run(updateQuery, updateParams);
            await db.close();

            res.status(200).json({ status: true, message: 'Dados atualizados com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação.' });
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
                return res.status(200).json({ status: false, message: 'Cadeira inexistente' });
            }

            await db.run(removeQuery, removeParams);
            await db.close();

            res.status(200).json({ status: true, message: 'Cadeira deletado com sucesso!' });
        } catch (err) {
            await db.close();
            console.error(err.message);
            res.status(200).json({ status: false, message: 'Houve um erro na solicitação' });
        }
    }
}

export default CadeiraController;