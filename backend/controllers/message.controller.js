import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getAllUsers = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne:loggedInUserId }}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to fetch users" });
    }
}
export const getmessages = async (req,res) => {
  try {
    const {id:userToChatId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
        ]
    })
    res.status(200).json(messages);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to fetch messages" });
  }
}
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;

        if (!senderId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required." });
        }
        if (!text && !image) {
            return res.status(400).json({ message: "Message text or image is required." });
        }

        let imgUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }

        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl,
        });

        await message.save();

        const recieverSocketId = getRecieverSocketId(receiverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error("Error sending message:", error.stack || error);
        res.status(500).json({ message: "Failed to send message" });
    }
};
