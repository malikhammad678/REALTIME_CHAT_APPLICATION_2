import express from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';


const authRoutes = express.Router();


authRoutes.post("/signup", signup )
authRoutes.post("/login", login )
authRoutes.post("/logout", logout)
authRoutes.put("/update-profile", protectedRoute ,updateProfile)
authRoutes.get("/check",protectedRoute,checkAuth)


export default authRoutes