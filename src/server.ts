import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './interface/routes/authRoute';
import userRoute from './interface/routes/userRoute';
import adminRoute from './interface/routes/adminRoute';
import cookieParser from 'cookie-parser';
import { env } from './config/authConfig';

dotenv.config();
const app = express();

//Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser())


//Router setUp
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);



//connecting mongoDB
mongoose.connect(process.env.MONGO_URI!).then(() => {
    console.log('Mongo DB connected 📎')
});

const PORT = env.PORT || 5000;

app.listen(PORT, () => console.log('Celoura is running 🏃‍♂️'))