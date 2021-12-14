import axios from 'axios';

export default function setAuthToken(token) {
    if(token){
        //apply to every request 
        // console.log("this is auth token ",token);
        axios.defaults.headers.common['Authorization'] = token;

    } else {
        //delete the auth header
        delete axios.defaults.headers.common['Authorization'];
    }
}
