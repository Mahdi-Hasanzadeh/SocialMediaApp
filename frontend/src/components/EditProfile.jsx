
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '@/redux/authSlice';
import { toast } from 'sonner';


const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        username : user?.username,
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        console.log("selected file :",file)
        if (file) setInput({ ...input, profilePhoto: file })
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const editProfileHanlder = async () => {
        const formData = new FormData();
        formData.append('bio', input.bio);
        formData.append('username',input.username);
        formData.append('gender', input.gender);
        if (input.profilePhoto) {
            formData.append('profilePhoto', input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post('https://socialmediaapp-waa8.onrender.com/api/v2/user/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    username: res.data.user?.username,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender,
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);

            }
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else {
                console.error('Error message:', error.message);
            }
            toast.error(error.message);
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between  bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="post_image" />
                            <AvatarFallback ><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
                        </Avatar>

                        <div>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input type="file" onChange={fileChangeHandler} ref={imageRef} className='hidden' />
                    <Button onClick={() => imageRef?.current.click()} className="bg-[#0095F6] h-8 hover:bg-[#318bc7]">Change photo</Button>
                </div>
                <div>
                <h1 className='font-bold text-xl mb-2'>Username</h1>
                <input type='text' value={input.username} onChange={(e) => setInput({ ...input, username: e.target.value })} className="focus-visible:ring-transparent" name='username' />
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} className="focus-visible:ring-transparent" name='bio' />
                </div>
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="others">Others</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (
                            <Button className="w-fit bg-[#0095F6] hover:bg-[#318bc7]">
                                <Loader2 className='mr-2 w-4 h-4 animate-spin' />Please wait</Button>
                        ) : (
                            <Button onClick={editProfileHanlder} className="w-fit bg-[#0095F6] hover:bg-[#318bc7]">Submit</Button>
                        )
                    }

                </div>
            </section>
        </div>
    )
}

export default EditProfile;