import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck, BookmarkCheckIcon, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost, updatePostBookmark } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'



const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user,suggestedUser } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  // const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [liked, setLiked] = useState((post?.likes || []).includes(user?._id));
  const [postLike, setPostLike] = useState((post?.likes || []).length);
  const [comment, setComment] = useState(post?.comments || []);
  const [bookmarked, setBookmarked] = useState(post?.bookmarked || false);

  // const [postLike, setPostLike] = useState(post.likes.length);
  // const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHanlder = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText("");
    }
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`https://socialmediaapp-waa8.onrender.com/api/v2/post/${post?._id}/${action}`, { withCredentials: true });

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        //Now Update the post update 
        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`https://socialmediaapp-waa8.onrender.com/api/v2/post/${post._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(res.data)
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://socialmediaapp-waa8.onrender.com/api/v2/post/delete/${post?._id}`, { withCredentials: true });

      if (res.data.success) {
        const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }

    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const bookmarkHandler = async() => {
    try {
      const action = bookmarked ? 'remove' : 'add';
      const res = await axios.get(`https://socialmediaapp-waa8.onrender.com/api/v2/post/${post?._id}/bookmark`,{withCredentials:true});

      if(res.data.success){
        const newBookmarkState = !bookmarked;
      setBookmarked(newBookmarkState); 
      dispatch(updatePostBookmark({ postId: post._id, bookmarked: newBookmarkState }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className='my-8 w-full max-w-sm mx-auto pr-5'>
        <div className='flex items-center justify-between'>
         <Link to={`/profile/${post.author?._id}`}>
         <div className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
            </Avatar>
            <div className='flex items-center gap-3'>
            <h1>{post.author?.username}</h1>
           {user?._id === post.author._id && <Badge variant={"secondary"}>Author</Badge>} 
            </div>
          </div>
         </Link>
          <Dialog >
            <DialogTrigger asChild>
              <MoreHorizontal className='cursor-pointer' />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              {
                post?.author?._id !== user?._id && <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
              }
              
              <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
              {/* {
                user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
              } */}

              {
                user && user?._id === post?.author?._id && (
                  <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button>
                )
              }


            </DialogContent>
          </Dialog>
        </div>

        <img className='rounded-sm my-2 w-full aspect-square object-cover'
          src={post.image} alt="post_image" />


        <div className='flex items-center justify-between my-3'>
          <div className='flex items-center gap-3'>
            {
              liked ? <FaHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer text-red-600 hover:border' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600 hover:border' />
            }

            <MessageCircle onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }} className='cursor-pointer hover:text-gray-600' />
            <Send className='cursor-pointer hover:text-gray-600' />
          </div>
          {bookmarked ? (
    <BookmarkCheckIcon className={`cursor-pointer text-blue-600`} onClick={bookmarkHandler} />
  ) : (
    <Bookmark onClick={bookmarkHandler} className={`cursor-pointer hover:text-gray-600`} />
  )}
         
          
        </div>

        <span className='font-medium block mb-2' >{postLike} likes</span>
        <p className=''>
          <span className='font-medium mr-2'>{post.author?.username}</span>
          {post.caption}
        </p>
        {
          comment.length > 0 && (
            <span onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>
          )
        }

        <CommentDialog open={open} setOpen={setOpen} />

        <div className='flex items-center justify-between'>
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHanlder}
            className="outline-none text-sm w-full"
          />
          {
            text && <span className='text-[#3BADF8] cursor-pointer' onClick={commentHandler}>Post</span>
          }

        </div>

      </div>
    </>
  )
}

export default Post