import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstances } from "../lib/axios.js";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignup: false,
  isLogin: false,
  isUpdating: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Check user authentication status
  checkAuth: async () => {
    try {
      const response = await axiosInstances.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // User signup
  signup: async (data) => {
    set({ isSignup: true });
    try {
      const response = await axiosInstances.post("/auth/signup", data);
      toast.success("Account Created Successfully!");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in signup:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      set({ isSignup: false });
    }
  },

  // User logout
  logout: async () => {
    try {
      await axiosInstances.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error in logout:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  },

  // User login
  login: async (data) => {
    set({ isLogin: true });
    try {
      const response = await axiosInstances.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Login successful!");
      get().connectSocket();
    } catch (error) {
      console.error("Error in login:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      set({ isLogin: false });
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isUpdating: true });
    try {
      const response = await axiosInstances.put("/auth/update-profile", data);
      set({ authUser: response.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error in updateProfile:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      set({ isUpdating: false });
    }
  },

  // Connect socket
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    set({ socket: newSocket });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Disconnect socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected manually");
    }
  },
}));
