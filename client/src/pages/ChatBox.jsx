import React from 'react'
import Chating from '../components/chat/Chating.jsx'
import { useSelector } from 'react-redux';
import useChat from '../store/slices/useChat.js';

const ChatBox = () => {
     const { user } = useSelector(state => state.user);
  const { messages, sendMessage } = useChat(user._id);

   
  return (
    <div className=''>
       
        <Chating 
      userId={user._id}
      targetId="admin"
      messages={messages}
      sendMessage={sendMessage}
      classes={"w-full h-[100vh] bg-gray-800"} />
    </div>
  )
}

export default ChatBox