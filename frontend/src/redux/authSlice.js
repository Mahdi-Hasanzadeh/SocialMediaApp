import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null
    },
    reducers:{
        //actions
        setAuthUser:(state,action)=>{
            state.user = action.payload
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers = action.payload
        },
        setUserProfile:(state,action)=>{
            state.userProfile = action.payload
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload
        },
          // New action to update the followers list
          updateUserFollowers: (state, action) => {
            const { userId, isFollowing } = action.payload;

            if (state.userProfile && state.userProfile._id === userId) {
                if (isFollowing) {
                    state.userProfile.followers = state.userProfile.followers.filter(
                        (id) => id !== state.user._id
                    );
                } else {
                    state.userProfile.followers.push(state.user._id);
                }
            }
        },
    }
});

export const {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUser,updateUserFollowers} = authSlice.actions;
export default authSlice.reducer;