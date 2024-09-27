import jwt from "jsonwebtoken";
import { secret } from "../config/index.js";

function getTokenFromHeader(req) {
    if (!req.headers.authorization) return null;
    return req.headers.authorization.split(" ")[1];
}

const auth = (req, res, next) => {
    const token = getTokenFromHeader(req);
    if (!token) {
        return res.status(401).json({ errors: { message: "Token not provided"}})
    }

    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            return res.status(401).json({ errors: { message: "Invalid token"}})
        }

        req.payload = decoded;
        next();
    });
}

export default auth;