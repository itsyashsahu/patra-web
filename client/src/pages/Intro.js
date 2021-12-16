import React,{useRef,useEffect,useState} from 'react'
import '../assests/style-intro.css'
import Navhome from '../Components/Navhome'
import lottie from "lottie-web";
import {Link} from 'react-router-dom';
import Fade from 'react-reveal/Fade';

export default function Intro() {
    const [ signupText , setSignupText ] = useState(false)
    const setSignupFun = ()=>{
        setSignupText(false)
    }
    const container = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/75471-forex-trading.json')
        })
    },[])

    const container1 = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container1.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/52229-arrowleft.json')
        })
    },[signupText])


    return (
        <>
        <Navhome page="LogIn" />
        <section className="intro-section">
            <div className="intro-section-wrapper">
                <div className="intro-frontBanner-description">

                    <div className="into-tagline-section">
                    <Fade left>
                        <div className="intro-tagline">
                            <span>Learn Investing</span><br/>
                            <p>
                                Without using your hard earned money, <br/>
                                Get exposed to the beautiful world of Investing .
                            </p>
                            <div className="button-box"  >
                                <button type="submit" name="signup" id="signup" 
                                value="Register" 
                                onMouseOver={()=>{setSignupText(true)
                                                    // console.log("onMouseOver")    
                                } }
                                onMouseOut={()=>{ 
                                    setTimeout( setSignupFun , 4000)
                                    // console.log("onMouseOut")    
                                } }

                                    >
                                <Link to="/signup">
                                {
                                    (signupText)?
                                    <span>
                                        <p>Sign up Now !!!</p>
                                        <div className='signupText-arrow' ref={container1}></div> 
                                    </span>:
                                    <p>Start Your Journey Today</p>


                                }
                                </Link>
                                </button>
                            </div>

                        </div>
                        </Fade>
                    </div>

                </div>

                <Fade right>
                <div className="intro-frontBanner-img">
                    {/* this contains the lottie animation */}
                    <div className="intro-front-lottie" ref={container}>
                    </div>
                </div>
                </Fade>
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

            </div>
        </section>
        </>
    )
}
