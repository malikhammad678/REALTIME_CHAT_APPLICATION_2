import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import Sidebar from './Sidebar.jsx';
import NoChatSelected from './NoChatSelected.jsx';
import ChatContainer from './ChatContainer.jsx';

const Home = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className='h-screen bg-base-200'>
     <div className='flex items-center justify-center pt-20 px-4'>
         <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-full h-[cal(100vh-8rem)]'>
            <div className='flex h-full rounded-lg overflow-hidden'>
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
         </div>
     </div>
    </div>
  )
}

export default Home
