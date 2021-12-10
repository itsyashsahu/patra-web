import React,{useState,useEffect,useRef} from 'react'
import {Link,useHistory} from 'react-router-dom'
import NavbarMobile from './NavbarMobile'
import QuickDashboard from './QuickDashboard'
import {useSelector,useDispatch} from 'react-redux';
import axios from 'axios'
import lottie from "lottie-web";
import { updateEditedUser } from '../redux/userReducer';

export default function Userinfo() {
    const history = useHistory();

    const [ isUserUpdated , setIsUserUpdated ] = useState(false);
    // for setting up lotties 
    const container = useRef(null)
    useEffect( () => {
        lottie.loadAnimation({
            container: container.current,
            renderer:'svg',
            loop: true ,
            autoplay:true,
            animationData: require('../assests/lotties/80036-done.json')
        })
    },[isUserUpdated])

    const user = useSelector( (state)=> state.user.user )
    const [ editUser , setEditUser ] = useState(false)
    const dispatch = useDispatch();
    // note here gender and Gender are two different variables 
    const [ Gender , setGender ] = useState('')
    const [inputs, setInputs] = useState({
        name: null,
        proffession: null,
        dob:null,
        phone:null,
        gender:null,
    });
    const { name, proffession ,dob , phone } = inputs;

    var userName;
    if(user.name){
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        userName = capitalizeFirstLetter(user.name);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
        if( name === 'gender'){
            // console.log("gender has changed ")
            if(value==='Male'){
                console.log("gender Male")
                setGender("Male")
            }
            if(value==='Female'){
                console.log("gender FeMale")
                setGender("Female")

            }
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(inputs)
        
        // axios.post('http://localhost:4000/users/updateinfo', finalInput)
        axios.post('api/users/updateinfo', inputs )
        .then( (res) =>{
            console.log(res);
            if(res.status===200){
                setIsUserUpdated(true)
                setInputs('')
                const turnModalOff = () =>{
                    dispatch(updateEditedUser(inputs))
                    setIsUserUpdated(false)
                    setEditUser(!editUser)
                    // console.log(isUserUpdated)
                }
                setTimeout(turnModalOff, 1000);
            }
            
        })
        .catch( (err) => {
            console.log(err)
            // if(err.response.status===424){
            //     setDisplayUserAlreadyExsits(true)
            // }
        });
        
    }

    const logout = () =>{
        console.log("logout was called")
        sessionStorage.removeItem('jwtToken');
        history.push("./")
    }
    return (
            <div className="userInfo">
                <div className="userInfo-wrapper">

                    <div className="userInfoImg">
                        <svg className="userImgIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path></svg>
                        <div className="userInfodetails">
                            <div className="userInfo-username">{userName}</div>
                            {/* <div className="userInfo-clientId">Client ID : 26745</div> */}
                            <div className="userInfo-proffession">{user.proffession}</div>
                        </div>
                        <Link to="#" onClick={()=>{
                                setEditUser(!editUser);
                                console.log(editUser);
                                }} className="userInfo-editIcon" >
                            {/* <!-- edit icon svg --> */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12.9 6.858l4.242 4.243L7.242 21H3v-4.243l9.9-9.9zm1.414-1.414l2.121-2.122a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414l-2.122 2.121-4.242-4.242z"/></svg>
                        </Link>
                    </div>
                    {
                        editUser?
                        <form  method="POST" onSubmit={handleSubmit} >
                            {
                                (isUserUpdated)?
                                <div className="userInfo-updated" ref={container} ></div>:

                                <div class="userInfo-split-editUser">
                                <div>
                                    <div class="form-credentials signup-form-input">
                                        <div>
                                            <i class="ri-user-fill"></i>
                                            <input type="text" name="name" placeholder="Your Name" 
                                                value={name} onChange={handleChange}/>
                                        </div>
                                    </div>
                                    <div class="form-credentials signup-form-input">
                                        <div>
                                            {/* <i class="ri-user-fill"></i> */}
                                            <i class="ri-nurse-fill"></i>
                                            <input type="text" name="proffession" placeholder="Proffession" 
                                                value={proffession} onChange={handleChange}/>
                                        </div>
                                    </div>
                                    <div class="form-credentials signup-form-input">
                                        <div>
                                            {/* <i><b>DOB</b></i> */}
                                            {/* <i class="ri-calendar-fill"></i> */}
                                            {/* <i class="ri-cake-2-fill"></i> */}
                                            <i class="ri-cake-fill"></i>
                                            <input type="date" name="dob" placeholder="DOB"
                                                value={dob} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="form-credentials signup-form-input">
                                        <div>
                                            <i class="ri-phone-fill"></i>
                                            <input type="phone" className="numberFont" name="phone" placeholder="Phone No." 
                                                value={phone} onChange={handleChange}/>
                                        </div>
                                    </div>
                                    <div class="form-credentials signup-form-input">
                                        <div>
                                            {/* <i class="ri-user-fill"></i> */}
                                            {/* <i class="ri-genderless-fill"></i> */}
                                            {
                                                (!Gender)?
                                                <i class="ri-genderless-fill"></i>:
                                                    (Gender==="Male")?
                                                    <i class="ri-men-fill"></i>:
                                                        (Gender==='Female')?
                                                        <i class="ri-women-fill"></i>:null
                                            }
                                            {/* {
                                                (Gender==="Male")?
                                                <i class="ri-men-fill"></i>:
                                                    (Gender==='Female')?
                                                    <i class="ri-women-fill"></i>:null
                                            } */}
                                            {/* <i class="ri-men-fill"></i>
                                            <i class="ri-women-fill"></i> */}
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
                                    <div class="form-credentials signup-submit ">
                                        <div>
                                            <button type="submit" name="signup" id="signup" 
                                            value="Register">Register</button>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                
                            }
                        </form> :

                        <div className="userInfo-split">
                        <div>
                            {/* <!-- <div>Edit Your Information</div> --> */}
                            <div><Link to="#" >Change Your Password</Link> </div>
                            <div><Link to="#"> Forgot Password</Link> </div>
                            <div><Link to="#"> Recieve Alerts on Mail</Link> </div>
                            <div><Link to="#"> Recieve Notifications</Link> </div>
                        </div>
                        <div>
                            <div> Funds </div>
                            <div className="userInfo-split-details" >
                                <span to="#"> Funds Available </span>
                                <span className="numberFont" to="#"> ₹&nbsp;{user.fundsAvailable} </span>
                            </div>
                            {/* <div className="userInfo-split-details" >
                                <Link to="#"> Funds Used </Link>
                                <Link className="numberFont" to="#"> $400 </Link>
                            </div> */}
                            <div><Link to="#"> Request More Virtual Money </Link></div>
                            <div class="signup-submit ">
                                <div>
                                    <button type="submit" name="signup" id="signup" 
                                    onClick={logout}
                                    value="Register">Logout</button>
                                </div>
                            </div>
                        </div>
                        </div>

                    }
                </div>
                
            <NavbarMobile/>

            <QuickDashboard/>
        </div>
    )
}
