// PACKAGES
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// MODULES
import db from './config/dbconnection.js';
import models from './models/index.js';
import router from './router/index.js';

// LOAD ENVIRONMENT VARIABLES
dotenv.config();

// SETUP MONGODB
const isProduction = process.env.NODE_ENV === "production";
const dbURI = isProduction ? db.ProductionURI : db.DevURI;
mongoose.connect(dbURI, { useNewUrlParser: true });

// START
const app = express();

// SETTINGS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

// ROUTER INTEGRATION
app.use("/", router);

// 404 - ROTA
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// ROTA - 422, 500, 401
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    if(error.status !== 404) console.warn("Error: ", error.message, new Date());
    res.json({ error });
});


// LISTENING
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if(error) throw error;
    console.log(`Listening on http://localhost:${PORT}`);
});