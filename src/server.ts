import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './interface/routes/authRoute';
import userRoute from './interface/routes/userRoute';
import adminRouter from './interface/routes/adminRoute';
import guideRouter from './interface/routes/guideRoute'
import cookieParser from 'cookie-parser';
import { env } from './config/authConfig';
import passport from 'passport';

dotenv.config();
const app = express();

//Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());
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