import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { secret } from "../config/index.js";

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "O campo nome deve ser fornecido"]
    },
    telefone: {
        type: String,
        required: [true, "O campo telefone deve ser fornecido"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "O campo email deve ser fornecido"]
    },
    senha: String,
    salt: String,
    tipo: {
        type: String,
        enum: ["cliente", "barbeiro", "gerente"],
        default: "cliente"
    }
}, { timestamps: true });


UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.senha = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
};

UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
    return hash === this.hash;
};

UserSchema.methods.generateToken = function() {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 15);

    return jwt.sign({
        id: this._id,
        nome: this.nome,
        telefone: this.telefone,
        email: this.email,
        tipo: this.tipo,
        exp: parseFloat(exp.getTime() / 1000, 10)
    }, secret);
};

UserSchema.methods.sendAuthJSON = function() {
    return {
        id: this._id.toString(),
        nome: this.nome,
        telefone: this.telefone,
        email: this.email,
        tipo: this.tipo,
        token: this.generateToken()
    };
};

export default mongoose.model("User", UserSchema);