import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    transHistoryArr : []
  }
// both the given code perform same task bas yeh thoda kam code 
// likhna pada aur purane parameters bhi pass nhi krne pade


export const transHistoryReducer = createSlice({
    name:"transHistory",
    initialState,
    reducers:{
        setTransHistory:(state,action)=>{
            const payload = action.payload;
            state.transHistoryArr.push(payload)
        }
    }
})

export const {setTransHistory} = transHistoryReducer.actions; 

export default  transHistoryReducer.reducer;




