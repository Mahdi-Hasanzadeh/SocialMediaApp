import { createSlice } from "@reduxjs/toolkit";

const RTN = createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification : [],
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type === 'like'){
                state.likeNotification.push(action.payload);
            }else if (action.payload.type === 'dislike'){
                 state.likeNotification = state.likeNotification.filter((item)=> item.userId !== action.payload.userId);   
            }
        },
       
    }

});

export const {setLikeNotification} = RTN.actions;
export default RTN.reducer;