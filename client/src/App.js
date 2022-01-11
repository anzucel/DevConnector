import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import PrivateRoute from './components/routing/PrivateRoute';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUSer } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import { addEducation } from './actions/profile';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => { // cuando algo se actualiza, este se mantiene activo recibiendo actualizaciones
    store.dispatch(loadUSer);
  }, []); // only run once

  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        {/*página principal de login*/}
        <Navbar />
        <Routes>
        <Route path='/' element={<Landing/>}/>
        </Routes>
        <section className='container'>
        <Alert />
          <Routes>
              <Route path='/register' element={<Register/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/profiles' element={<Profiles/>}/>
              <Route path='/profile/:id' element={<Profile/>}/>
              <Route path='/dashboard' element={<Dashboard/>}/> {/* private */}
              <Route path='/create-profile' element={<CreateProfile/>}/>
              <Route path='/edit-profile' element={<EditProfile/>}/>
              <Route path='/add-experience' element={<AddExperience/>}/>
              <Route path='/add-education' element={<AddEducation/>}/> {/* private */}
              <Route path='/posts' element={<Posts/>}/> {/* private */}
              <Route path='/posts/:id' element={<Post/>}/> {/* private */}
{/*               <Route 
                path="dashboard/*" 
                element={<PrivateRoute element={Dashboard}/>}
              /> */}
          </Routes>
        </section>
        </Fragment>
    </Router>
    </Provider>
)};

export default App; 
