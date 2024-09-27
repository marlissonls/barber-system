import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const AppointmentSchema = new mongoose.Schema({
    usuario_id: { type: ObjectId, ref: "User", required: true },
    cadeira_id: { type: ObjectId, ref: "Chair", required: true },
    servico_id: { type: ObjectId, ref: "Service", required: true },
    data: { type: Number, required: true },
    hora: { type: Number, required: true },
    status: { type: String, enum: ["pendente", "concluído", "cancelado"], default: "pendente" }
}, { timestamps: true });

AppointmentSchema.methods.sendDataJSON = function() {
    return {
        id: this._id.toString(),
        usuario_id: this.usuario_id.toString(),
        cadeira_id: this.cadeira_id.toString(),
        servico_id: this.servico_id.toString(),
        data: this.data,
        hora: this.hora,
        status: this.status
    }
};

export default mongoose.model("Appointment", AppointmentSchema);