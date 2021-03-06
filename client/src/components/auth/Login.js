import React, {Fragment, useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import {PropTypes} from 'prop-types';
import { login } from '../../actions/auth';
//import axios from 'axios'

export const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const onChange = (e) => setFormData({...formData, [e.target.name]: e.target.value}); // copy of formdata
    const onSubmit = async (e) => {e.preventDefault();
        login(email, password);
    }
    //e.target.name = toma el nombre del input (campo)

    //Navigate if logged in
    if(isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)}> {/*Login form*/}
                    <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email} 
                        onChange={e => onChange(e)}
                        required/>
                    </div>
                    <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password} 
                        onChange={(e) => onChange(e)}
                        minLength="6"
                    />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
                <p className="my-1">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
        </Fragment>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStatetoProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStatetoProps, {login})(Login);