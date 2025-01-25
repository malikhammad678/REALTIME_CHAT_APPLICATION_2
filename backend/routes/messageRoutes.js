import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getAllUsers, getmessages, sendMessage } from '../controllers/message.controller.js';

const messageRoutes = express.Router();

messageRoutes.get("/users",protectedRoute, getAllUsers);
messageRoutes.get("/:id",protectedRoute, getmessages);
messageRoutes.post("/send/:id",protectedRoute,sendMessage);

export default messageRoutes;