import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstances } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    setSelectedUsers: (selectedUser) => set({ selectedUser }),
    getUsers: async () => {
        set({isUsersLoading:true})
        try {
            const response = await axiosInstances.get("/message/users");
            set({users:response.data})
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);            
        }finally{
            set({isUsersLoading:false})
        }
    },
    getMessages : async (userId) => {
          set({isMessagesLoading:true})
          try {
            const response = await axiosInstances.get(`/message/${userId}`);
            set({messages:response.data})
          } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
          }finally{
            set({isMessagesLoading:false})
          }
    },
    sendMessage : async (messageData) => {
       const {selectedUser,messages} = get();
       try {
        const response = await axiosInstances.post(`/message/send/${selectedUser._id}`,messageData);
        set({messages:[...messages,response.data]})
       } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
       }
    },
    subscribeToMessages: () => {
      const { selectedUser } = get();
      if(!selectedUser) return;
      const socket = useAuthStore.getState().socket;

      socket.on("newMessage",(newMessage) => {
        if(newMessage.senderId !== selectedUser._id) return;
        set({
          messages: [...get().messages, newMessage],
        })
      })
    },
    unsubscribeToMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage")
    }
    
}))