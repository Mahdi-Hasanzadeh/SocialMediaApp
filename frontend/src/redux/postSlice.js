import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        selectedPost: null,
        bookmarked : []
    },
    reducers: {
        //actions
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        updatePostBookmark: (state, action) => {
            const { postId, bookmarked } = action.payload;
            const postIndex = state.posts.findIndex(post => post._id === postId);
            if (postIndex !== -1) {
              state.posts[postIndex].bookmarked = bookmarked;
            }
          },
    }
})

export const { setPosts, setSelectedPost,updatePostBookmark } = postSlice.actions;
export default postSlice.reducer;