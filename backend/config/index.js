import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.NODE_ENV === "production" ? process.env.SECRET : "SD62315C84A6532C54FDFEAD532C5DFE322ASDF5";
const api = process.env.NODE_ENV === "production" ? "https://api.barber-system.server.com" : "http://localhost:3000";
const barberSystem = process.env.NODE_ENV === "production" ? "https://barber-system.server.com" : "http://localhost:8000";

export { secret, api, barberSystem };