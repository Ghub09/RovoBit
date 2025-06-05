import React from 'react'
import ChatBox from '../../components/message/chatBox'
import Users from '../../components/message/Users'

const Messages = () => {
  return (
    <div className='py-2 flex '>
        <div className='w-[30%] border'>
         <Users/>
        </div>
        <div className='w-[70%] border items-center'>
        <ChatBox/>
        </div>
      
    </div>
  )
}

export default Messages
