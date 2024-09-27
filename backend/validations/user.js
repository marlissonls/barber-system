import Joi from "./joi.js";

const userValidation = {
    index: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    },
    store: {
        body: {
            nome: Joi.string().required(),
            telefone: Joi.string().length(11).required(),
            email: Joi.string().email().required(),
            senha: Joi.string().min(6).required(),
        }
    },
    login: {
        body: {
            identificador: Joi.string().required(),
            senha: Joi.string().min(6).required(),
        }
    }
}

export default userValidation;