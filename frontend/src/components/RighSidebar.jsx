import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RighSidebar = () => {
  const { user } = useSelector(store => store.auth);


  return (
    <>
      <div className="hidden md:block w-fit my-10 pr-28">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${user?._id}`}>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>
                <img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <span className="text-gray-600 text-sm">{user?.bio || 'Bio here...'}</span>
          </div>
        </div>

        <SuggestedUsers />
      </div>
    </>
  );
}

export default RighSidebar