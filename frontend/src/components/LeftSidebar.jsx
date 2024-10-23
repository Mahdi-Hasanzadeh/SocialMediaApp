import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Heart, Home, LogInIcon, LogOut, Logs, LogsIcon, MedalIcon, MessageCircle, PlusSquare, Search, TrendingUp, } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'


const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);


    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v2/user/logout", { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login")
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log("Logout error", error)
            toast.error(error.response.data.message);
        }
    }



    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === 'Create') {
            setOpen(true);
        } else if (textType === 'Profile') {
            navigate(`/profile/${user?._id}`);
        } else if (textType === 'Home') {
            navigate('/')
        } else if (textType === 'Messages') {
            navigate('/chat')
        }

    }


    const sidebarItems = [
        {
            icon: <Home />, text: "Home"
        },
        {
            icon: <Search />, text: "Search"
        },
        {
            icon: <TrendingUp />, text: "Explore"
        },
        {
            icon: <MessageCircle />, text: "Messages"
        },
        {
            icon: <Heart />, text: "Notification"
        },
        {
            icon: <PlusSquare />, text: "Create"
        },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        {
            icon: <LogOut />, text: "Logout"
        },
    ]

 

    return (
        <div>
          <div className="fixed top-0 left-0 z-10 h-full w-16 md:w-48 border-r border-gray-300 bg-white">
            <div className="flex flex-col items-center md:items-center">
              <h1 className="my-8 pl-3 font-bold text-lg md:text-xl hidden md:block">⚡SOCIAL HUB⚡</h1>
              <div>
                {sidebarItems.map((item, index) => (
                  <div
                    onClick={() => sidebarHandler(item.text)}
                    key={index}
                    className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 w-full"
                  >
                    {item.icon}
                    <span className="hidden md:inline">{item.text}</span> {/* Show text only on medium screens and up */}
                    {item.text === 'Notification' && likeNotification.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button size="icon" className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
                            {likeNotification.length}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div>
                            {likeNotification.length === 0 ? (
                              <p>No new notifications</p>
                            ) : (
                              likeNotification.map((notification) => (
                                <div key={notification.userId} className="flex items-center gap-2 py-2">
                                  <Avatar>
                                    <AvatarImage src={notification.userDetails?.profilePicture} alt="profileimage" />
                                    <AvatarFallback>
                                      <img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          {/* Create post modal */}
          <CreatePost open={open} setOpen={setOpen} />
        </div>
      );
    
}

export default LeftSidebar