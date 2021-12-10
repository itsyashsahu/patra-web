import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    reportArr : []
  }
// both the given code perform same task bas yeh thoda kam code 
// likhna pada aur purane parameters bhi pass nhi krne pade


export const reportReducer = createSlice({
    name:"report",
    initialState,
    reducers:{
        setReport:(state,action)=>{
            const payload = action.payload;
            state.reportArr.push(payload)
        }
    }
    
})

export const {setReport} = reportReducer.actions; 

export default  reportReducer.reducer;




