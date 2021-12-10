import React from 'react'
import { Route ,Switch} from 'react-router-dom';
import './assests/style.css'
import Mainarea from './Components/Mainarea';
import PrivateRoute from './Components/PrivateRoute';
import Signup from './pages/Signup';
import Signin from './pages/Signin'
import Modal from './Components/Modal'
import {useSelector} from 'react-redux';
import Intro from './pages/Intro';
import AboutUs from './pages/AboutUs';

function App() {
  const showOptions = useSelector( (state)=> state.watchlist.showOptions )

  return (
    <>
    {showOptions&& <Modal/>}
    {/* <Modal/> */}
    <div>
      
    <Switch>
      <Route exact path="/home" component={Intro} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/aboutus" component={AboutUs} />
        {/* <Route eaxct path="/" component={Mainarea} > */}
          <PrivateRoute>
            <Mainarea/>
          </PrivateRoute>
    </Switch>
    </div>
    </>
  );
}

export default App;
