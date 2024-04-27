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
    verificaTipo: (req, res) => {
        const token = getTokenFromHeader(req);
        if (!token) {
            return res.status(200).json({ errors: { message: "Não autenticado." } });
        }

        try {
            const payload = new Promise((resolve, reject) => {
                jwt.verify(token, process.env.SECRET, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            return res.status(200).json({ status: true, payload });
        } catch (error) {
            return res.status(200).json({ errors: { message: "Não autenticado." } });
        }
    },
    // verificaTipo: (req, res) => {
    //     const token = getTokenFromHeader(req);
    //     if (!token) {
    //         return res.status(200).json({ errors: { message: "Não autenticado." } });
    //     }

    //     let payload;
    //     jwt.verify(token, process.env.SECRET, (err, decoded) => {
    //         if (err) {
    //             return res.status(200).json({ errors: { message: "Não autenticado." } });
    //         }
    //         payload = decoded;
    //     });

    //     return res.status(200).json({ status: true, payload})
    // },
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