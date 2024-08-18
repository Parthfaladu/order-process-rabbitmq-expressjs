import express, {json} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import {connectToRabbitMQ} from "./services/rabbitmqService";
import routes from './routes/route';

// init app
const app = express();

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongodb:27017/order-process';

connectToRabbitMQ();

// connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
    } else {
        console.log('Connected to MongoDB');
    }
});

//middleware
app.use(json());
app.use(helmet());
app.use(morgan('common'));

// routes
app.use(routes);

app.listen(3000, () => {
    console.log(`app listening on port ${process.env.SERVER_PORT}`);
});