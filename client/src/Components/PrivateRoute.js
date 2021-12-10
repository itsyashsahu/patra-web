import React from "react";
import {Route,Redirect} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {setCurrentUser } from '../redux/userReducer'
import jwtDecode from 'jwt-decode';

const PrivateRoute = ({children, ...rest}) => {
    
    var isAuth = false;
    
    const dispatch = useDispatch();
    const isReduxSet = useSelector( (state)=>{
        return state.user.isAuth;
    })

    //verifying user form browser storage
    const token = sessionStorage.getItem('jwtToken');
    var decoded;//to store the decoded jwt token as we need to store it to redux state
    if(token){
    //getting token back from browser and decodeing it to get userId 
    //if userId is set then we have a user means signined in
        decoded = jwtDecode(token);
        isAuth = true;
        
        if(!isReduxSet){
            dispatch(setCurrentUser(decoded) );
        }

    }
    return (
        <Route {...rest} 
            render={()=> isAuth?(children):(<Redirect to={'/home'} /> ) }
        />
    );
}

export default PrivateRoute;