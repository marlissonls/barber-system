import dotenv from 'dotenv';
dotenv.config();

export default {
    DevURI: `mongodb://${process.env.MONGODB_HOST_DEV}:27017/barber-system-api-dev`,
    ProductionURI: `mongodb://${process.env.MONGODB_HOST_PRODUCTION}:27017/barber-system-api`
};