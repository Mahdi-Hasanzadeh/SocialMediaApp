import React, { useEffect } from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RighSidebar from './RighSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  useEffect(() => {
    window.scrollTo(0, 0,'smooth')
  }, [])
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RighSidebar />
    </div>
  )
}

export default Home