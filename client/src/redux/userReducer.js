import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    user : null,
    isAuth : false,
    
  }
export const userReducer = createSlice({
    name:"person",
    initialState,
    reducers:{
        setCurrentUser: (state,action)=>{
            // console.log(state.user,action.payload   );
            state.user = action.payload
            state.isAuth = true
        },
        updateUser: (state,action)=>{
            // console.log(action.payload)
            if(state.user){
                state.user.fundsAvailable = Math.round( ( state.user.fundsAvailable + action.payload ) * 100) / 100 ;
                // console.log(state);
            }
        },
        setUser: (state,action)=>{
            state.user = { ...state.user , ...action.payload }
            // console.log(state.user.name);
        },
        updateEditedUser: (state,action)=>{
            const { name, proffession,dob,phone } = action.payload;
            // console.log("state",state )
            // console.log("state.isAuth",state.isAuth)
            // console.log("action.payload" , action.payload)
            // take the funds available
            if(name){
                state.user.name = name;
            }
            if(proffession){
                state.user.proffession = proffession;

            }
            if(dob){
                state.user.dob = dob;

            }
            if(phone){
                state.user.phone = phone;

            }

        }
    }
})

export const {setCurrentUser,updateUser,setUser,updateEditedUser} = userReducer.actions; 

export default userReducer.reducer;





