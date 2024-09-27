import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const ChairSchema = new mongoose.Schema({
    nome: { type: String, required: [true, "O campo cadeira deve ser fornecido"] },
    status: { type: String, enum: ["livre", "ocupado"], default: "livre" },
    folga: { type: Number, enum: [0, 1], default: 0 },
    barbeiro_id: { type: ObjectId, ref: "User", required: true },
    hora8: { type: Number, enum: [0, 1], default: 0 },
    hora9: { type: Number, enum: [0, 1], default: 0 },
    hora10: { type: Number, enum: [0, 1], default: 1 },
    hora11: { type: Number, enum: [0, 1], default: 1 },
    hora12: { type: Number, enum: [0, 1], default: 1 },
    hora13: { type: Number, enum: [0, 1], default: 1 },
    hora14: { type: Number, enum: [0, 1], default: 1 },
    hora15: { type: Number, enum: [0, 1], default: 1 },
    hora16: { type: Number, enum: [0, 1], default: 1 },
    hora17: { type: Number, enum: [0, 1], default: 1 },
    hora18: { type: Number, enum: [0, 1], default: 1 },
    hora19: { type: Number, enum: [0, 1], default: 1 },
    hora20: { type: Number, enum: [0, 1], default: 1 },
    hora21: { type: Number, enum: [0, 1], default: 0 },
    hora22: { type: Number, enum: [0, 1], default: 0 },
    hora23: { type: Number, enum: [0, 1], default: 0 }
},{ timestamps: true });

ChairSchema.methods.sendDataJSON = function() {
    return {
        id: this._id.toString(),
        nome: this.nome,
        status: this.status,
        folga: this.folga,
        hora8: this.hora8,
        hora9: this.hora8,
        hora10: this.hora10,
        hora11: this.hora11,
        hora12: this.hora12,
        hora13: this.hora13,
        hora14: this.hora14,
        hora15: this.hora15,
        hora16: this.hora16,
        hora17: this.hora17,
        hora18: this.hora18,
        hora19: this.hora19,
        hora20: this.hora20,
        hora21: this.hora21,
        hora22: this.hora22,
        hora13: this.hora13
    }
}

export default mongoose.model("Chair", ChairSchema);