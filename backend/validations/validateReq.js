import Joi from "./joi.js";

const validateReq = (schema) => {
    return (req, res, next) => {
        if (schema.hasOwnProperty("params")) {
            const { error } = Joi.object(schema.params).validate(req.params);
            if (error) return res.status(200).json({ status: false, message: "Verifique os dados e tente novamente" });
            // if (error) return res.status(400).json({ error });
        }

        if (schema.hasOwnProerty("body")) {
            const { error } = Joi.object(schema.body).validate(req.body);
            if (error) return res.status(200).json({ status: false, message: "Verifique os dados e tente novamente" });
            // if (error) return res.status(400).json({ error });
        }

        if (schema.hasOwnProperty("query")) {
            const { error } = Joi.object(schema.query).validade(req.query);
            if (error) return res.status(200).json({ status: false, message: "Verifique os dados e tente novamente" });
            // if (error) return res.status(400).json({ error });
        }

        next();
    }
}

export default validateReq;