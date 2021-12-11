import React ,{ useEffect,useRef} from 'react'
import { Route,Switch} from 'react-router-dom'
import WatchlistHeader from '../pages/WatchlistHeader'
import Navbar from '../pages/Navbar'
import Watchlist from '../pages/Watchlist'
import Dashboard from '../pages/Dashboard'
import Holding from '../pages/Holding'
import TransHistory from '../pages/TransHistory'
import Reports from '../pages/Reports'
import Userinfo from '../pages/Userinfo'
import SearchStock from '../pages/SearchStock'
// import Intro from '../pages/Intro'
import ScrollToBottom from 'react-scroll-to-bottom';


export default function Mainarea() {
    const scrollDiv = useRef(null);
    const scrollToBottom = () =>{
        scrollDiv.current.scrollIntoView({ behavior: "smooth"});
    }
    useEffect(scrollToBottom,[])

    return (
        <>
        <scrollToBottom>
            <div className= "navbar" ref={scrollDiv} >
                <WatchlistHeader/>
                <Navbar/>
                {/* <div> */}
                <Watchlist />
                {/* </div> */}


                <Switch>

                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/holdings" component={Holding}/>
                    <Route exact path="/transhistory" component={TransHistory} />
                    <Route exact path="/reports" component={Reports} />
                    <Route exact path="/userinfo" component={Userinfo} />
                    <Route exact path="/searchstock" component={SearchStock} />
                    {/* <Route exact path="/intro" component={Intro} /> */}
                    {/* <Route exact path="/watchlist" >
                        
                    </Route> */}
                        
                </Switch>
            </div>
        </scrollToBottom>
        </>
    )
}
