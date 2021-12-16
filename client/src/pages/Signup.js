import React, {useEffect,useRef,useState } from 'react'
import Navhome from '../Components/Navhome'
import {Link,useHistory} from 'react-router-dom';
import lottie from "lottie-web";
import axios from "axios"
import Fade from 'react-reveal/Fade';

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
    const [ isAllFieldsSet , setIsAllFieldsSet ] = useState(false);
    const [ forwardForm , setForwardForm ] = useState(false);
    const [ validationErr , setValidationErr ] = useState('');
    const [ Gender , setGender ] = useState('')

    var [inputs, setInputs] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword:'',
        proffession:'',
        dob:null,
        gender:null,
        phone:null
    });

    const { name, email, password,confirmPassword,proffession,dob,phone } = inputs;
    function handleChange(e) {
        setIsAllFieldsSet(false)
        setDisplayUserAlreadyExsits(false)
        var { name, value } = e.target;
        // below lines are in development phase
        if( name === 'email'){
            value = value.toLowerCase();
        }
        setInputs(inputs => ({ ...inputs, [name]: value }));
        if( name === 'confirmPassword'){
            setIsPasswordMatching(false)
            setInputs((state) => {
                // console.log(state,state.confirmPassword);
                if(state.confirmPassword === password){
                    setIsPasswordMatching(true);
                }
                
                return state;
              });
        }
        if( name === 'gender'){
            // console.log("gender has changed ")
            if(value==='Male'){
                // console.log("gender Male")
                setGender("Male")
            }
            if(value==='Female'){
                // console.log("gender FeMale")
                setGender("Female")

            }
        }
        

    }

    function handleSubmit(e) {
        e.preventDefault();
        
        // console.log("why", (phone.length>=10 && phone.length<=11) )
        if(isPasswordMatching && phone.length>=10 && phone.length<=11){
            axios.post('api/users', inputs)
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

        }else{
            setValidationErr( "Please Enter Correct Phone Number")
            setIsAllFieldsSet(true)
        }
        
    }

    function forwardTheForm() {
        // console.log(inputs)
        if(inputs.name && inputs.proffession && inputs.gender && inputs.dob ){
            // console.log("congrats input hoon mein",inputs);
            setForwardForm(true)
        }else{
            setValidationErr( "Please Fill All The Fields")
            setIsAllFieldsSet(true)
        }
    }

    return (
        <>
        <Navhome page="LogIn" />
        <section className="signup-section">
        <div className="section-wrapper">
            <Fade left>
            <div className="signup-form-wrapper">
                
                <div className="signup-form-div">
                    <form  method="POST" onSubmit={handleSubmit} >

                    <div className="signup-form-heading">
                        Sign Up
                    </div>

                    {
                        (!forwardForm)?
                        <>
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
                                {/* <i className="ri-lock-2-fill"></i>  */}
                                <i className="ri-nurse-fill"></i>

                                <input type="text" name="proffession" autoComplete="off"
                                value={proffession} onChange={handleChange}
                                placeholder="Proffession" required/>
                            </div>
                        </div>
                        <div className="form-credentials signup-form-input">
                            <div>
                                {/* <i><b>DOB</b></i> */}
                                {/* <i className="ri-calendar-fill"></i> */}
                                {/* <i className="ri-cake-2-fill"></i> */}
                                <i className="ri-cake-fill"></i>
                                <input type="date" name="dob" placeholder="DOB"
                                    value={dob} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-credentials signup-form-input">
                            <div>
                                {/* <i className="ri-user-fill"></i> */}
                                {/* <i className="ri-genderless-fill"></i> */}
                                {
                                    (!Gender)?
                                    <i className="ri-genderless-fill"></i>:
                                        (Gender==="Male")?
                                        <i className="ri-men-fill"></i>:
                                            (Gender==='Female')?
                                            <i className="ri-women-fill"></i>:null
                                }
                                {/* {
                                    (Gender==="Male")?
                                    <i className="ri-men-fill"></i>:
                                        (Gender==='Female')?
                                        <i className="ri-women-fill"></i>:null
                                } */}
                                {/* <i className="ri-men-fill"></i>
                                <i className="ri-women-fill"></i> */}
                                {/* <input type="text" name="name" placeholder="Gender" /> */}
                                <select name="gender" placeholder="Gender"
                                    onChange={handleChange}>
                                    {/* <option value="Male">
                                        Select an option
                                    </option> */}
                                    <option disabled selected hidden>Select Your Gender</option>
                                    <option value="Male">
                                        Male
                                    </option>
                                    <option onClick={()=>setGender("Female")} value="Female">
                                        Female
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="form-credentials signup-submit ">
                            <div>
                                <button onClick={forwardTheForm} type="button" name="" id="" 
                                >Next </button>
                            </div>
                        </div>

                        </>
                        :

                        <Fade left>
                        <>
                            <div className="form-credentials signup-form-input">
                                <div>
                                    <i className="ri-phone-fill"></i>
                                    <input type="number" className="numberFont" name="phone" placeholder="Phone No." 
                                        value={phone} onChange={handleChange} required/>
                                </div>
                            </div>
                            <div className="form-credentials signup-form-input">
                                <div>
                                    <i className="ri-mail-fill"></i> 
                                    <input type="text" name="email" 
                                    value={email} onChange={handleChange} autoComplete="off"
                                    placeholder="Your E-mail" required/>
                                </div>
                            </div>
                            <div className="form-credentials signup-form-input">
                                <div>
                                    <i className="ri-lock-2-fill"></i> 
                                    <input type="password" name="password" autoComplete="off"
                                    value={password} onChange={handleChange}
                                    placeholder="Password" required/>
                                </div>
                            </div>
                            <div className="form-credentials signup-form-input">
                                <div>
                                    <i className="ri-lock-2-line"></i> 
                                    <input type="password" name="confirmPassword" 
                                    value={confirmPassword} onChange={handleChange}
                                    placeholder="Confirm Password" required />
                                </div>
                            </div>
                            <div className="form-credentials checkbox-agree-hidden">
                                <div>
                                    <input type="checkbox" className="checkbox-agree-input" name="agreeTnc" placeholder="Repeat Your Password" required/>
                                    <div>I agree to &nbsp;<Link to="#"> Terms & Conditions</Link></div>
                                </div>
                            </div>
                            <div className="form-credentials signup-submit ">
                                <div>
                                    <button type="submit" name="signup" id="signup" 
                                    value="Register">Register</button>
                                </div>
                            </div>
                        </>
                            </Fade>

                    }

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
                    isAllFieldsSet?<div className= "wrong-credentials-signup" >
                                <i className="ri-error-warning-line"></i>
                                    {/* Please Fill All The Fields */}
                                    {validationErr}
                                </div>:null
                }
                {
                    (!isPasswordMatching)?<div className= "wrong-credentials-signup" >
                                <i className="ri-error-warning-line"></i>
                                    Password is Not Matching
                                </div>:null
                }

            </div>
            </Fade>
            <Fade right>
            <div className="signup-img">
                <div className="signup-lottie" ref={container}>
                </div>
                <div>
                    I am already a Member ? &nbsp; <Link to="/signin">Login here</Link> 
                </div>
            </div>
            </Fade>
        </div>
            <div class="aboutNfeedback-NavMobile-section">
                <div class="aboutme">
                    <Link to="/aboutus">
                        About Me
                    </Link>
                </div>
                <div class="feedback">
                    <Link to="#">
                        Feedback
                    </Link>
                </div>
            </div>
        </section>
    </>
    )
}
