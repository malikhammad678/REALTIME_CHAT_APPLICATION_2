import express from 'express'
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/messageRoutes.js';
import cors from 'cors'
import { app, server } from './lib/socket.js';


dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const port = process.env.PORT || 5000

app.use(express.json({ limit:'50mb' }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);


server.listen(port, () => {
    connectDB()
    console.log(`app is listen on ${port} PORT!`);
})