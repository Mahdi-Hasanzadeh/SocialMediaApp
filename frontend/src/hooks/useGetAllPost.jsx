import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setPosts } from "@/redux/postSlice"

const useGetAllPost = () =>{
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchAllPost = async () =>{
            try {
                const res = await axios.get('https://socialmediaapp-waa8.onrender.com/api/v2/post/all',{withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.post)
                    dispatch(setPosts(res.data.post));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllPost();
    },[]);
};

export default useGetAllPost;