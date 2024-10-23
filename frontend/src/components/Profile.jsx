import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign, Heart, MessageCircle } from 'lucide-react'


const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const { userProfile, user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.post : userProfile?.bookmarks

  return (
    <>
      <div className='flex max-w-5xl md:flex-row justify-center mx-auto pl-10'>
        <div className='flex flex-col gap-20 p-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <section className='flex items-center justify-center'>
              <Avatar className="h-60 w-60">
                <AvatarImage src={userProfile?.profilePicture} alt="profilePhoto" />
                <AvatarFallback><img src="https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png" alt="" /></AvatarFallback>
              </Avatar>
            </section>
            <section>
              <div className='flex flex-col gap-5 '>
                <div className='flex items-center gap-2'>
                  <span >{userProfile?.username}</span>
                  {
                    isLoggedInUserProfile ? (
                      <>
                        <Button variant="secondary" className="hover:bg-gray-200 h-8"><Link to={'/account/edit'}>Edit profile</Link></Button>
                        <Button variant="secondary" className="hover:bg-gray-200 h-8">View archive</Button>
                        <Button variant="secondary" className="hover:bg-gray-200 h-8">Ad tools</Button>
                      </>
                    ) : (
                      isFollowing ? (
                        <>
                          <Button variant="secondary" className="hover:bg-gray-200 h-8">Unfollow</Button>
                          <Button variant="secondary" className="hover:bg-gray-200 h-8">Message</Button>
                        </>
                      ) : (
                        <Button className="bg-[#0085F6] hover:bg-[#3192d2] h-8">Follow</Button>
                      )

                    )
                  }
                </div>
                <div className='flex items-center gap-4'>
                  <p className='flex gap-1'> <span className='font-semibold'>{userProfile?.post.length}</span>posts</p>
                  <p className='flex gap-1'> <span className='font-semibold'>{userProfile?.followers.length}</span>followers</p>
                  <p className='flex gap-1'> <span className='font-semibold'>{userProfile?.following.length}</span>following</p>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                  <Badge className="w-fit" variant={"secondary"}><AtSign /> <span className='pl-1'>{userProfile?.username}</span></Badge>
                  <span>🧑🏻‍💻 Coding is love</span>
                  <span>😎 Experiments with codes</span>
                  <span>❤️ DM for collaboration</span>
                </div>
              </div>
            </section>
          </div>

          <div className='border-t border-t-gray-200'>
            <div className='flex items-center justify-center gap-10 text-sm'>
              <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
                POSTS
              </span>
              <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
                SAVED
              </span>
              <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ''}`} onClick={() => handleTabChange('reels')}>
                REELS
              </span>
              <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ''}`} onClick={() => handleTabChange('tags')}>
                TAGS
              </span>
            </div>
            <div className='grid grid-cols-3 gap-1'>
              {
                displayedPost?.map((post) => {
                  return (
                    <div key={post?._id} className='relative group cursor-pointer'>
                      <img src={post.image} alt="postimage" className='rounded-sm my-2 w-full aspect-square object-cover' />
                      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <div className='flex items-center text-white space-x-4'>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <Heart />
                            <span>{post?.likes.length}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <MessageCircle />
                            <span>{post?.comments.length}</span>
                          </button>

                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>

          </div>

        </div>

      </div>
    
    </>
  )
}

export default Profile