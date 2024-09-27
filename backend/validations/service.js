import Joi from "./joi.js";

const serviceValidation = {
    index: {
        id: Joi.string().alphanum().length(24).required()
    }
};

export default serviceValidation;