import mongoose from "mongoose";

const Chair = mongoose.model("Chair");
const Service = mongoose.model("Service");

class ChairController {

    // POST /register


    // GET /get
    async index(req, res) {
        const barbeiroId = req.payload.id;

        try {
            const chair = await Chair.findOne({barbeiro_id: barbeiroId})
            if (!chair) return res.status(200).json({ status: false, message: "Cadeira não encontrada"});
            
            return res.status(200).json({ status: true, message: "", cadeira: chair.sendDataJSON() });
        } catch (err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Falha na solicitação"});
        };
    };

    // GET /getAll
    async showAll(req, res) {
        try {
            const chairs = await Chair.find({ status: "livre" })
            if (chairs.length === 0) return res.status(200).json({ status: false, message: "Nenhuma cadeira encontrada" });

            return res.status(200).json({
                status: true,
                message:"",
                cadeiras: chairs.map(chair => chair.sendDataJSON())
            })
        } catch (err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Falha na solicitação"});
        };
    };
    
    // GET /showServices
    async showServices(req, res) {
        const cadeiraId = req.params.id;

        try {
            const cadeira = await Chair.findOne({ _id: cadeiraId });
            if (!cadeira) return res.status(200).json({ status: false, message:"Nenhuma cadeira encontrada" });    

            const servicos = await Service.find({ cadeira_id: cadeiraId });

            return res.status(200).json({ status: true, message: "", cadeira: cadeira.sendDataJSON(), servicos: servicos.sendDataJSON() });
        } catch (err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Erro interno no servidor"});
        }

    };
    
    // PUT /update
    async update(req, res) {
        const barbeiroId = req.payload.id;
        const { nome, status, horario } = req.body;
        
        try {
            const cadeira = await Chair.findOne({ barbeiro_id: barbeiroId });
            if (!cadeira) return res.status(200).json({ status: false, message:"Nenhuma cadeira encontrada" });    

            const updateFields = {};

            if (!nome) updateFields.nome = nome;
            if (!status) updateFields.status = status;
            if (!horario) updateFields[horario] = cadeira[horario] ? 0 : 1;

            await Chair.updateOne({ barbeiro_id: barbeiroId }, { $set: updateFields });

            return res.status(200).json({ status: true, message: "Atualizado!"});
        } catch (err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Erro interno no servidor"});
        };
    };

    // DELETE /remove
}

export default ChairController;