import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path, { format } from 'path';
import authRoutes from './interface/routes/authRoute';
import userRoute from './interface/routes/userRoute';
import adminRouter from './interface/routes/adminRoute';
import guideRouter from './interface/routes/guideRoute'
import cookieParser from 'cookie-parser';
import { env } from './config/authConfig';
import passport from 'passport';
import winston from 'winston';
import morgan from 'morgan';



//morgan setUp
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => new Date().toLocaleString()
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});


const stream = {
    write: (message: string) => logger.info(message.trim()),
}


dotenv.config();
const app = express();



//Middleware setup
app.use(express.json());
app.use(morgan('combined', { stream }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(cookieParser());
app.use(passport.initialize())


//Router setUp
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRouter);
app.use('/api/guide', guideRouter);



//connecting mongoDB
mongoose.connect(process.env.MONGO_URI!).then(() => {
    console.log('Mongo DB connected 📎')
});

const PORT = env.PORT || 5000;
console.log(PORT)

app.listen(PORT, () => console.log('Celoura is running 🏃‍♂️'))