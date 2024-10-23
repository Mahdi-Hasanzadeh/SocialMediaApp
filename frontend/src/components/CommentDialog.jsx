import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({ open, setOpen }) => {
    const [text,setText] = useState("");
    const {selectedPost,posts} = useSelector(store => store.post);
    const [comment,setComment] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(selectedPost){
            setComment(selectedPost.comments)
        }
    },[selectedPost])

    const changeEventHanlder = (e)=>{
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }

    const sendMessageHanlder = async () => {
        try {
          const res = await axios.post(`http://localhost:8000/api/v2/post/${selectedPost?._id}/comment`, { text }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
         
          if (res.data.success) {
            const updatedCommentData = [...comment, res.data.comment];
            setComment(updatedCommentData);
    
            const updatedPostData = posts.map(p =>
              p._id === selectedPost._id ? { ...p, comment: updatedCommentData } : p
            );
    
            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
            setText("")
          }
        } catch (error) {
          console.log(error)
        }
      }
    return (
        <>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col outline-none">
                    <main className='flex-1 flex'>
                        <div className="w-1/2">
                            <img src={selectedPost?.image} alt="post_img" className='w-full h-full object-cover rounded-l-lg' />
                        </div>

                        <div className='w-1/2 flex flex-col justify-between'>
                            <div className='flex items-center justify-between p-4'>
                                <div className='flex gap-3 items-center'>
                                    <Link>
                                        <Avatar>
                                            <AvatarImage src={selectedPost?.author?.profilePicture} />
                                            <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
                                        </Avatar>
                                    </Link>

                                    <div>
                                        <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                                        {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                                    </div>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal className='cursor-pointer' />
                                    </DialogTrigger>
                                    <DialogContent className="flex flex-col items-center text-sm text-center outline-none">
                                        <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                                            Unfollow
                                        </div>
                                        <div className='cursor-pointer w-full'>
                                            Add to favorites
                                        </div>
                                    </DialogContent>
                                </Dialog>

                            </div>
                            <hr />
                            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                               {
                                comment.map((comment)=> <Comment key={comment._id} comment={comment}/>)
                               }
                            </div>
                            <div className='p-4'>
                                <div className='flex items-center gap-2'>
                                    <input onChange={changeEventHanlder} value={text} type="text" placeholder='Add a comment...' className='w-full text-sm outline-none border border-gray-300 p-2 rounded' />
                                    <Button disabled={!text.trim()} onClick={sendMessageHanlder} variant="outline">Send</Button>
                                </div>
                            </div>
                        </div>
                    </main>

                </DialogContent>
            </Dialog>
        </>
    )

};


export default CommentDialog;