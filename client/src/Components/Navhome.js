import React from 'react'
import {Link} from 'react-router-dom';


export default function Navhome(props) {
    var redirectpage="#";
    if(props.page==="LogIn"){
        redirectpage="signin";
    }
    else if(props.page==="Sign Up"){
        redirectpage="signup";
    }
    return (
    <div className="nav-home">
        <div className="logo-home">
            <Link to="/">PaTra</Link>
        </div>
        <ul className="nav-full-menu">
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to= {`/${redirectpage}`} className="login-btn-Insignup" >{props.page}</Link></li>
        </ul>
    </div> 
    )
}
