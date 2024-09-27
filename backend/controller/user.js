import mongoose from "mongoose";

const User = mongoose.model("User");

class UserController {
    
    // POST / registrar
    async store (req, res, next) {
        const { nome, telefone, email, senha } = req.body;

        try {
            const user = await new User({ nome, telefone, email });
            user.setPassword(senha);
            await user.save();
            return res.status(200).json({ status: true, message: "Usuário criado com sucesso" });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve erro na solicitação" });
        }
    };

    // POST /login
    async login(req, res, next) {
        const { identificador, senha } = req.body;
        const isEmail = identificador.includes("@");
        const query = isEmail ? { email: identificador } : { telefone: identificador }

        try {
            const usuario = await User.findOne(query);
            if (!usuario) {
                const errorMessage = isEmail ? "Email não cadastrado" : "Número de telefone não cadastrado";
                return res.status(200).json({ status: false, message: errorMessage });
            };

            if (!usuario.validatePassword(senha)) return res.status(200).json({ status: false, message: "Senha inválida" });

            return res.status(200).json({ status: true, message: "", usuario: usuario.sendAuthJSON() });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve erro na solicitação" });
        };
    }

    // GET /
    async index(req, res, next) {
        const userId = req.params.id;

        try {
            const usuario = await User.findById(userId)
            if (!usuario) return res.status(200).json({ status: false, message: "Cliente não registrado" });
            
            return res.json({ status: true, message: "", usuario: usuario.sendAuthJSON() });
        } catch(err) {
            console.error(err);
            return res.status(200).json({ status: false, message: "Houve erro na solicitação" });
        };
    };
}

export default UserController;