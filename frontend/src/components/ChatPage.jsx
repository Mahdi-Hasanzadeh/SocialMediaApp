import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowLeft, MessageCircleCode, X} from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {

            const res = await axios.post(`https://socialmediaapp-waa8.onrender.com/api/v2/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    },[]);
    
    return (
        <>
            <div className='flex ml-[16%] h-screen'>
                <section className='md:w-1/4 my-8 '>
                    <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                    <hr className='mb-4 border-gray-300' />
                    <div className='overflow-y-auto h-[80vh] '>
                        {
                            suggestedUsers.map((suggestedUser) => {
                                const isOnline = onlineUsers.includes(suggestedUser?._id);
                                return (
                                    <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer'>
                                        <Avatar className="w-14 h-14">
                                            <AvatarImage src={suggestedUser?.profilePicture}></AvatarImage>
                                            <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col'>
                                            <span className='font-medium'>{suggestedUser?.username}</span>
                                            <span className={`text-xs font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>
                <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                {selectedUser ? (
                    <>
                        {/* Header with Close Button for Small Screens */}
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                            <button onClick={() => dispatch(setSelectedUser(null))} className='md:hidden text-gray-600 hover:text-gray-900'>
                                <X size={24} />
                            </button>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                                <AvatarFallback>
                                    <img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="profile" />
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>

                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                            <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className="flex mr-2 focus-visible:ring-transparent" placeholder="Messages..." />
                            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                        </div>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto'>
                        <MessageCircleCode className='w-32 h-32 my-4' />
                        <h1 className='font-medium text-xl'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )}
            </section>
            </div>
            {/* <div className='flex ml-[16%] h-screen'>
                <section className='md:w-1/4 my-8 '>
                    <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                    <hr className='mb-4 border-gray-300' />
                    <div className='overflow-y-auto h-[80vh] '>
                        {
                            suggestedUsers.map((suggestedUser) => {
                                const isOnline = onlineUsers.includes(suggestedUser?._id);
                                return (
                                    <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer'>
                                        <Avatar className="w-14 h-14">
                                            <AvatarImage src={suggestedUser?.profilePicture}></AvatarImage>
                                            <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col'>
                                            <span className='font-medium'>{suggestedUser?.username}</span>
                                            <span className={`text-xs font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>

                {
                    selectedUser ? (
                        <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
                            <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
                                <Avatar>
                                    <AvatarImage src={selectedUser?.profilePicture} alt="profile"></AvatarImage>
                                    <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="profile" /></AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span>{selectedUser?.username}</span>
                                </div>
                            </div>

                            <Messages selectedUser={selectedUser} />
                            <div className='flex items-center p-4 border-t border-t-gray-300'>
                                <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className="flex mr-2 focus-visible:ring-transparent" placeholder="Messages..." />
                                <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                            </div>
                        </section>
                    ) : (

                        <div className='flex flex-col items-center justify-center mx-auto'>
                            <MessageCircleCode className='w-32 h-32 my-4' />
                            <h1 className='font-medium text-xl'>Your messages</h1>
                            <span>Send a message to start a chat.</span>
                        </div>
                    )
                }
            </div> */}


   
    
        </>
    )
}

export default ChatPage;