import React, {useEffect,useRef,useState } from 'react'
import Navhome from '../Components/Navhome'
import {Link , useHistory} from 'react-router-dom';
import lottie from "lottie-web";
import '../assests/fonts/remixicon.css'
import axios from "axios";
import jwtDecode from 'jwt-decode';
import setAuthToken from '../Components/setAuthToken' ;
import {useDispatch } from 'react-redux';
import {setCurrentUser } from '../redux/userReducer'



export default function Signup() {

    const dispatch = useDispatch();
    const [ displayFlex,setdisplayFlex] = useState(false);
    const [ displayUserNotFound,setdisplayUserNotFound] = useState(false);

    const container = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/50124-user-profile.json')
        })
    },[])

    const history = useHistory();
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
        agreeTnc:''
    });

    
    const { email, password } = inputs;
    // console.log(inputs);
    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
        setdisplayFlex(false);
        // console.log(e.target)
        setdisplayUserNotFound(false);
    }

    function handleSubmit(e) {
        e.preventDefault();

        // setSubmitted(true);
      
            // get return url from location state or default to home page
            // const { from } = location.state || { from: { pathname: "/" } };
        //     dispatch(userActions.login(username, password, from));

        axios.post('api/users/signin', inputs)
        .then( (res) =>{
            // console.log(res);

            if(res.status===201){
                if(inputs.agreeTnc){ 
                    //this gets called if the remember me id checked
                    // console.log(inputs.agreeTnc);
                    sessionStorage.setItem("isAuth","true");
                }
                // console.log(res.data.token);
                const token = res.data.token;
                
                sessionStorage.setItem('jwtToken',token)
                setAuthToken(token); //this is another file

                const decoded = jwtDecode(token);
                dispatch( setCurrentUser(decoded) );

                console.log(decoded);
                // dispatch(setCurrentUser(decoded) );
                if(decoded.userId){
                    // <Redirect to="/dashboard" /> 
                    // history.push("/home/dashboard")
                    history.push("./")
                }
            }
            if(res.status===401){
                console.log(res)
            }
        })
        .catch( (err) => {
            console.log(err);
            
            if(err.response.status===401){
                //user entered wrong credentials 
                setdisplayFlex(true);
            }
            if(err.response.status===422){
                //user does not exitss
                setdisplayUserNotFound(true);
            }
            console.log("err.status",err.response.status)
        });
        
    }

    return (
        <>
        <Navhome page="Sign Up" />
        <section className="signin-section">
        <div className="section-signin-wrapper">
            
            <div className="signin-img">
                <div className="signup-lottie" ref={container}>
                </div>
                <div>
                    Not a Member ? &nbsp; <Link to="/signup">Signup here</Link> 
                </div>
            </div>

            <div className="signin-form-div">
            <form  method="POST" onSubmit={handleSubmit} >
                <div className="signup-form-heading">
                    Log in
                </div>
                <div className="form-credentials signup-form-input">
                    <div>
                        <i className="ri-mail-fill"></i> 
                        <input type="email" name="email" 
                        value={email} onChange={handleChange}
                        placeholder="Your Email" required />
                    </div>
                </div>
                <div className="form-credentials signup-form-input">
                    <div>
                        <i className="ri-lock-2-fill"></i> 
                        <input type="password" name="password" 
                        value={password} onChange={handleChange}
                        placeholder="Password" required/>
                    </div>
                </div>
                <div className="form-credentials checkbox-agree-hidden">
                    <div>
                        <input type="checkbox" className="checkbox-agree-input" name="agreeTnc"
                        value="true" onChange={handleChange}
                         placeholder="agree Tnc"/>
                        <div>Remember Me</div>
                    </div>
                </div>
                {
                   displayFlex?<div className= "wrong-credentials" >
                                <i className="ri-error-warning-line"></i>
                                    You Have Entered Wrong credentials
                                </div>:""
                }
                {
                   displayUserNotFound?<div className= "wrong-credentials" >
                                <i className="ri-error-warning-line"></i>
                                    This email does not belong to any account
                                </div>:""
                }
                {/* <div className={`wrong-credentials ${displayFlex}`} >
                <i className="ri-error-warning-line"></i>
                    You Have Entered Wrong credentials
                </div> */}
                <div className="form-credentials signup-submit ">
                    <div>
                        <button type="submit" name="signup" id="signup" 
                        value="Register">Login</button>
                    </div>
                </div>
                <div className="login-option-onSignup">Not a Member ? &nbsp;<Link to="signup">Signup here</Link></div>
            </form>
            </div>
        </div>
        </section>
    </>
    )
}
