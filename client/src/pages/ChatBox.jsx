import React from 'react'
import Chating from '../components/chat/Chating.jsx'
import { useSelector } from 'react-redux';

const ChatBox = () => {
    const {user} = useSelector((state) => state.user);
  return (
    <div className=''>
       
        <Chating userId={user._id} targetId={"admin"} classes={"w-full h-[70vh]"} />
    </div>
  )
}

export default ChatBox