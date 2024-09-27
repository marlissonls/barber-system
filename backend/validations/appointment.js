import Joi from "./joi.js";

const appointmentValidation = {
    store: {
        body: {
            usuario_id: Joi.string().alphanum().length(24).required(),
            cadeira_id: Joi.string().alphanum().length(24).required(),
            servico_id: Joi.string().alphanum().length(24).required(),
            data: Joi.number().required(),
            hora: Joi.string().required()
        }
    },
    userAppointments: {
        params: {
            userId: Joi.string().alphanum().length(24).required()
        }
    },
    barberAppointments: {
        params: {
            userId: Joi.string().alphanum().length(24).required()
        }
    },
    chairAppointments: {
        params: {
            cadeiraId: Joi.string().alphanum().length(24).required(),
            data: Joi.number().required()
        }
    },
    concludeAppointment: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    },
    cancelAppointment: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    },
    removeAppointment: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    }
}

export default appointmentValidation;