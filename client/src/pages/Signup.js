import React, {useEffect,useRef,useState } from 'react'
import Navhome from '../Components/Navhome'
import {Link,useHistory} from 'react-router-dom';
import lottie from "lottie-web";
import axios from "axios"

export default function Signup() {

    const history = useHistory();
    const container = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/62952-money-plant.json')
        })
    },[])

    const [ displayUserAlreadyExsits,setDisplayUserAlreadyExsits] = useState(false);
    const [ isPasswordMatching , setIsPasswordMatching ] = useState(true);

    var [inputs, setInputs] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword:'',
    });

    const { name, email, password,confirmPassword } = inputs;
    function handleChange(e) {

        setDisplayUserAlreadyExsits(false)
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
        if( name === 'confirmPassword'){
            setIsPasswordMatching(false)
            setInputs((state) => {
                console.log(state,state.confirmPassword);
                if(state.confirmPassword === password){
                    setIsPasswordMatching(true);
                }
                
                return state;
              });
        }


    }

    function handleSubmit(e) {
        e.preventDefault();
        if(isPasswordMatching){
            axios.post('http://localhost:4000/users', inputs)
            .then( (res) =>{
                // console.log(res);
                if(res.status===200){
                    history.push("./signin")
                }
                
            })
            .catch( (err) => {
                console.log(err)
                if(err.response.status===424){
                    setDisplayUserAlreadyExsits(true)
                }
            });

        }
        
    }


    return (
        <>
        <Navhome page="LogIn" />
        <section className="signup-section">
        <div className="section-wrapper">
            <div className="signup-form-wrapper">
                
                <div className="signup-form-div">
                    <form  method="POST" onSubmit={handleSubmit} >

                    <div className="signup-form-heading">
                        Sign Up
                    </div>
                    <div className="form-credentials signup-form-input">
                        <div>
                            <i className="ri-user-fill"></i>
                            <input type="text" name="name" 
                            value={name} onChange={handleChange}
                            placeholder="Your Name" required/>
                        </div>
                    </div>
                    <div className="form-credentials signup-form-input">
                        <div>
                            <i className="ri-mail-fill"></i> 
                            <input type="text" name="email" 
                            value={email} onChange={handleChange} autoComplete="off"
                            placeholder="Your E-mail" />
                        </div>
                    </div>
                    <div className="form-credentials signup-form-input">
                        <div>
                            <i className="ri-lock-2-fill"></i> 
                            <input type="password" name="password" autoComplete="off"
                            value={password} onChange={handleChange}
                            placeholder="Password" />
                        </div>
                    </div>
                    <div className="form-credentials signup-form-input">
                        <div>
                            <i className="ri-lock-2-line"></i> 
                            <input type="password" name="confirmPassword" 
                            value={confirmPassword} onChange={handleChange}
                            placeholder="Confirm Password" />
                        </div>
                    </div>
                    <div className="form-credentials checkbox-agree-hidden">
                        <div>
                            <input type="checkbox" className="checkbox-agree-input" name="agreeTnc" placeholder="Repeat Your Password" required/>
                            <div>I agree to &nbsp;<Link to="#"> Terms & Conditions</Link></div>
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className="form-credentials signup-submit ">
                        <div>
                            <button type="submit" name="signup" id="signup" 
                            value="Register">Register</button>
                        </div>
                    </div>
                    {/* this will be displayed when the website is in mobile view */}
                    <div className="login-option-onSignup">Or, I am already a Member ? &nbsp;<Link to="/signin">Login here</Link></div>
                    
                
                </form>
                </div>
                {
                    displayUserAlreadyExsits?<div className= "wrong-credentials-signup" >
                                <i className="ri-error-warning-line"></i>
                                    This Email is Already Registered consider Signing In 
                                </div>:null
                }
                {
                    (!isPasswordMatching)?<div className= "wrong-credentials-signup" >
                                <i className="ri-error-warning-line"></i>
                                    Password is Not Matching
                                </div>:null
                }

            </div>

            <div className="signup-img">
                <div className="signup-lottie" ref={container}>
                </div>
                <div>
                    I am already a Member ? &nbsp; <Link to="/signin">Login here</Link> 
                </div>
            </div>
        </div>
        </section>
    </>
    )
}
