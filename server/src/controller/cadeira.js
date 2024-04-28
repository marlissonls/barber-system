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

    async get(req, res) {
        const barbeiroId = req.payload.id;

        const cadeiraQuery = 'SELECT * FROM cadeiras WHERE usuario_id = ?';
        const cadeiraParams = [barbeiroId];

        const db = await getConnection();
        try {
            const cadeira = await db.get(cadeiraQuery, cadeiraParams);
            await db.close();

            return res.status(200).json({ status: true, cadeira });
        } catch (err) {
            console.error(err.message);
            return res.status(200).json({ status: true, message: 'Houve um erro na solicitação' });
        }
    };

    async getAll(req, res) {
        const query = "SELECT * FROM cadeiras WHERE status = 'livre'";

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
        const userId = req.payload.id
        const { nome, status, horario } = req.body;

        const checkCadeiraQuery = 'SELECT * FROM cadeiras WHERE usuario_id = ?';
        const checkCadeiraParams = [userId];

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

        if (horario) {
            updateFields += `${horario} = ?, `;
        }

        updateFields = updateFields.slice(0, -2);
        
        const db = await getConnection();
        try {
            const cadeira = await db.get(checkCadeiraQuery, checkCadeiraParams);
            if (!cadeira) {
                return res.status(200).json({ status: false, message: 'Cadeira não encontrada.' });
            }

            if (horario) {
                const valor = cadeira[horario]
                const mudarValor = valor ? 0 : 1
                updateParams.push(mudarValor)
            }

            const updateQuery = `UPDATE cadeiras SET ${updateFields} WHERE usuario_id = ?`;
            updateParams.push(userId);

            await db.run(updateQuery, updateParams);
            await db.close();

            res.status(200).json({ status: true, message: 'Atualizado!' });
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