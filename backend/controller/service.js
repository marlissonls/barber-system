import mongoose from "mongoose";

const Service = mongoose.model("Service");
const Chair = mongoose.model("Chair");
const Appointment = mongoose.model("Appointment");

class ServiceController {

    // POST /register

    // GET /index
    async index(req, res) {
        const servicoId = req.params.id;

        try {
            const servico = await Service.findOne({ _id: servicoId });
            if (!servico) return res.status(200).json({ status: false, message: "Serviço não encontrado"});

            const cadeiraId = servico.cadeira_id;
            const cadeira = await Chair.findOne({ _id: cadeiraId });
            const agendamentos = await Appointment.find({ cadeira_id: cadeiraId });

            return res.status(200).json({
                status: true,
                message: "",
                cadeira: cadeira.sendDataJSON(),
                servico: servico.sendDataJSON(),
                agendamentos: agendamentos.sendDataJSON(),
            });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Erro interno no servido" });
        };
    }

    // PUT /update
    // async update(req, res) {
    //     const servicoId = req.params.id;
    //     const { nome, preco } = req.body;

    //     try {

    //     } catch (err) {
    //         console.error(err);
    //         return res.status(200).json({ status: false, message: "Erro interno no servido" });
    //     }
    // }
};

export default ServiceController;