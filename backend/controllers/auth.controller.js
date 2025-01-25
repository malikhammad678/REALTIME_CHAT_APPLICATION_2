import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
export const signup   = async (req,res) => {
    const {fullname,email,password} = req.body;
    try {
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }
        const user = await User.findOne({
            email
        })
        if(user) {
            return res.status(400).json({message: "Email already exists"})
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            fullname:fullname,
            email:email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();


            res.status(201).json({
            _id : newUser._id,
            fullname : newUser.fullname,
            email : newUser.email,
            profilePic:newUser.profilePic
        })
        }
        else{
            return res.status(400).json({message: "Failed to create user"})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const login   = async(req,res) => {
    const {email,password} = req.body;
    try {
    
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "Invalid Credentials!"})
        }
        const isPassword = await bcryptjs.compare(password, user.password);
        if(!isPassword) {
            return res.status(400).json({message: "Invalid Credentials!"})
        }

        generateToken(user._id,res);
        res.status(200).json({
            _id : user._id,
            fullname : user.fullname,
            email : user.email,
            profilePic:user.profilePic
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const logout   = (req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Logged out successfully!"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}
export const updateProfile = async (req,res) => {
    const {profilePic} = req.body;
    try {
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message: "Please add a profile picture!"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updateUser)
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const checkAuth = async (req,res) => {
   try {
    res.json(req.user);
   } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Internal Server Error"})
   }
}