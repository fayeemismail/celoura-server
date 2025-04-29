import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './auth/interface/routes/authRoute';
import cookieParser from 'cookie-parser';
import { env } from './auth/config/authConfig';

dotenv.config()

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
    console.log('Mongo DB connected 📎')
});

const PORT = env.PORT || 5000;

app.listen(PORT, () => console.log('Celoura is running 🏃‍♂️'))