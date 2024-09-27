import mongoose from "mongoose";

const Appointment = mongoose.model("Appointment");
const Chair = mongoose.model("Chair");

class AppointmentController {

    // POST /store
    async store(req, res) {
        const { usuario_id, cadeira_id, servico_id, data, hora } = req.body;

        try {
            const today = new Date().setHours(0, 0, 0, 0);
            const appointments = await Appointment.find({ data: { $gte: today }});

            const availableAppointments = appointments.some(appoint => appoint.data === data && appoint.hora === hora);
            if (availableAppointments) return res.status(200).json({ status: false, message: "Cadeira já ocupada neste horario"});

            const appointment = new Appointment({ usuario_id, cadeira_id, servico_id, data, hora });
            await appointment.save();

            return res.status(200).json({ status: true, message: "Agendamento realizado" });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve um erro na solicitação" });
        };
    };

    // GET /userAppointments/:id
    async userAppointments(req, res) {
        const userId = req.params.userId;

        try {
            const appointments = await Appointment.find({ usuario_id: userId, status: "pendente" })
            .populate({ path: "usuario_id", select: "nome" })
            .populate({ paht: "servico_id", select: "nome preco" });

            const appointmentsData = appointments.map(appointment => ({
                id: appointment._id.toString(),
                data: appointment.data,
                hora: appointment.hora,
                nome_cadeira: appointment.cadeira_id?.nome,
                nome_servico: appointment.servico_id?.nome,
                preco_servico: appointment.servico_id?.preco
            }));

            return res.status(200).json({ status: true, message: "", data: appointmentsData})
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve um erro na solicitação" });
        }
    };

    // GET /barberAppointments/:id
    async barberAppointments(req, res) {
        const userId = req.params.userId;

        try {
            const cadeira = await Chair.findOne({ barbeiro_id: userId });
            
            if (!cadeira) return res.status(200).json({ status: false, message: "Nao autorizado" });

            const appointments = await Appointment.find({ cadeira_id: cadeira._id, status: "pendente" })
            .populate({ path: "cadeira_id", select: "nome" })
            .populate({ path: "servico_id", select: "nome preco" })
            .populate({ path: "usuario_id", select: "nome" });

            const appointmentsData = appointments.map(appointment => ({
                id: appointment._id.toString(),
                data: appointment.data,
                hora: appointment.hora,
                nome_cadeira: appointment.cadeira_id?.nome,
                nome_servico: appointment.servico_id?.nome,
                preco_servico: appointment.servico_id?.preco,
                nome_usuario: appointment.usuario_id?.nome
            }))

            return res.status(200).json({ status: true, message: "", data: appointmentsData });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve uma falha na solicitação" });
        }
    };

    // GET /chairAppointments/:cadeiraId/:data
    async chairAppointments(req, res) {
        const { cadeiraId, data } = req.params;

        try {
            const cadeira = await Chair.findOne({ _id: cadeiraId });
            if (!cadeira) return res.status(200).json({ status: false, message: 'Cadeira indisponível.'});

            const appointments = await Appointment.find({ cadeira_id: cadeiraId, data, status: "concluído" })
            .populate({ path: "cadeira_id", select: "nome" })
            .populate({ path: "servico_id", select: "nome preco" })
            .populate({ path: "usuario_id", select: "nome" });

            const appointmentsData = appointments.map(appointment => ({
                id: appointment._id.toString(),
                data: appointment.data,
                hora: appointment.hora,
                nome_cadeira: appointment.cadeira_id?.nome,
                cadeira_id: appointment.cadeira_id.toString(),
                nome_servico: appointment.servico_id?.nome,
                preco_servico: appointment.servico_id?.preco,
                nome_usuario: appointment.usuario_id?.nome
            }))

            return res.status(200).json({ status: true, message: "", data: appointmentsData });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve uma falha na solicitação" });
        };
    };

    // PUT /concludeAppointment/:id
    async concludeAppointment(req, res) {
        const id = req.params.id;

        try {
            const appointment = await Appointment.findOne({ _id: id });
            if (!appointment) return res.status(200).json({ status: false, message: 'Agendamento não encontrado' });

            await Appointment.updateOne({ _id: id }, { $set: { status: "concluído" } });

            return res.status(200).json({ status: true, message: 'Serviço concluído!' });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve uma falha na solicitação" });
        };
    };

    // PUT /cancelAppointment/:id
    async cancelAppointment(req, res) {
        const id = req.params.id;

        try {
            const appointment = await Appointment.findOne({ _id: id });
            if (!appointment) return res.status(200).json({ status: false, message: 'Agendamento não encontrado' });

            await Appointment.updateOne({ _id: id }, { $set: { status: "cancelado" } });

            return res.status(200).json({ status: true, message: 'Serviço concluído!' });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve uma falha na solicitação" });
        };
    };

    // DELETE /removeAppointment/:id
    async removeAppointment(req, res) {
        const id = req.params.id;
    
        try {
            const appointment = await Appointment.findOne({ _id: id });
            if (!appointment) return res.status(200).json({ status: false, message: 'Agendamento não encontrado' });
    
            await Appointment.deleteOne({ _id: id });
    
            return res.status(200).json({ status: true, message: 'Agendamento cancelado com sucesso!' });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve uma falha na solicitação" });
        }
    }
    
}

export default AppointmentController;