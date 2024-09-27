import Joi from "./joi.js";

const chairValidation = {
    showServices: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    },
    update: {
        body: {
            nome: Joi.string(),
            status: Joi.string(),
            horario: Joi.string()
        }
    }
};

export default chairValidation;