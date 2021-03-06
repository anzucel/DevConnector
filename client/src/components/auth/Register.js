import React, {Fragment, useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import propTypes from 'prop-types'
//import axios from 'axios'

export const Register = ({setAlert, register, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const {name, email, password, password2} = formData;
    const onChange = (e) => setFormData({...formData, [e.target.name]: e.target.value}); // copy of formdata
    const onSubmit = async (e) => {e.preventDefault();
        // password match
        if(password !== password2){
            setAlert('Password do not match', 'danger');
        }else{
            register({name, email, password});
           /*  const newUser = {
                name, email, password, password2
            }

            try {
                const config ={
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }

                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/users', body, config);

                console.log(res.data);
            } catch (err) {
                console.error(err.response.data);
            } */
        }

        if(isAuthenticated){
            return <Navigate to='/dashboard'/>
        }
    }
    //e.target.name = toma el nombre del input (campo)
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)}> {/*Register form*/}
                    <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        name="name" 
                        value={name} 
                        onChange={(e) => onChange(e)}
                       /*  required */
                    />
                    </div>
                    <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} 
                        onChange={e => onChange(e)} 
                        /* required */
                    />
                    <small className="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email</small
                    >
                    </div>
                    <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password} 
                        onChange={(e) => onChange(e)}
                        /* minLength="6" */
                    />
                    </div>
                    <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2} 
                        onChange={(e) => onChange(e)}
                        /* minLength="6" */
                    />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: propTypes.func.isRequired,
    register: propTypes.func.isRequired,
    isAuthenticated: propTypes.bool
}

const mapStatetoProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

{/*export default Register*/}
export default connect(mapStatetoProps, {setAlert, register})(Register);
