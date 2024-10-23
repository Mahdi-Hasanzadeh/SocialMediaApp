import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
    return (
        <>
            <div className='my-2'>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={comment?.author?.profilPicture}></AvatarImage>
                        <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
                    </Avatar>
                    <h1 className='font-bold text-sm'>{comment?.author.username} <span className='font-normal pl-1'>{comment?.text}</span></h1>

                </div>
            </div>
        </>
    )
}

export default Comment;