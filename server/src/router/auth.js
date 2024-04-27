import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

function getTokenFromHeader(req) {
    if (!req.headers.authorization) return null;
    return req.headers.authorization.split(" ")[1];
}

const auth = {
    required: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(200).json({ status: false, message: "Token JWT não fornecido" });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            req.payload = decoded
            next();
        } catch (err) {
            return res.status(200).json({ status: false, message: "Token Inválido" });
        }
    },
    verificaTipo: (req, res) => {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(200).json({ status: false, message: "Não autenticado." });
        }

        let payload;
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            payload = decoded
            return res.status(200).json({ status: true, payload });
        } catch (err) {
            return res.status(200).json({ status: false, message: "Não autenticado" });
        }
    },
    optional: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (!err) {
                    req.payload = decoded;
                }
                next();
            });
        } else {
            next();
        }
    }
};

export default auth;