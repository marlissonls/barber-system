import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const ServiceSchema = new mongoose.Schema({
    cadeira_id: { type: ObjectId, ref: "Chair", required: true },
    nome: { type: String, required: true },
    preco: { type: Number, required: true }
},{ timestamps: true });

ServiceSchema.methods.sendDataJSON = function() {
    return {
        id: this._id.toString(),
        cadeira_id: this.cadeira_id.toString(),
        nome: this.nome,
        preco: this.preco
    }
};

export default mongoose.model("Service", ServiceSchema);