import jwt from "jsonwebtoken";
import { secret } from "../config/index.js";

function getTokenFromHeader(req) {
    if (!req.headers.authorization) return null;
    return req.headers.authorization.split(" ")[1];
}

const auth = {
    required: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(401).json({ errors: { message: "Token JWT não fornecido" } });
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ errors: { message: "Token JWT inválido" } });
            }
            req.payload = decoded;
            next();
        });
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