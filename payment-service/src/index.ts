import express, {json} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectToRabbitMQ } from "./services/rabbitmqService";
import { processPayment } from "./controllers/PaymentController";

// init app
const app = express();

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/social-media';

connectToRabbitMQ().then(processPayment);

// connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true}, () => {
    console.log('Connected to MongoDB');
});

//middleware
app.use(json());
app.use(helmet());
app.use(morgan('common'));

app.listen(3000, () => {
    console.log(`app listening on port ${process.env.SERVER_PORT}`);
});