import React from 'react'
import Chating from '../components/chat/Chating.jsx'
import { useSelector } from 'react-redux';

const ChatBox = () => {
    const {user} = useSelector((state) => state.user);
  return (
    <div>
       
        <Chating userId={user._id} targetId={"admin"} classes={"w-full h-full"} />
    </div>
  )
}

export default ChatBox