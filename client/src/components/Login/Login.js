import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useHistory } from 'react-router-dom';
import './login.css';

const Login = () => {

    const [inputs, setInputs] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            history.push('/');
        }
    }, [history]);

    const submit = async (e) => {
        e.preventDefault();

        const config = {
            header: {
            'Content-Type': 'application/json'
            }
        }

        const body = { ...inputs };

        try {
            const data = await axios.post('/api/auth/login', body, config);
            
            localStorage.setItem('authToken', data.data.token);
            history.push('/');
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => setError(null), 5000);
        }

    }

    return (
        <div className="login-screen">
            <form className="login-screen__form">
                <h3 className="login-screen__title">Login</h3>
                {error && <span className="error-message">{ error }</span>}
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                        type="email" name="email" placeholder="E-mail" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                        type="password" name="password" placeholder="Password" required />
                </div>
                <button onClick={submit} className="btn btn-primary">LogIn</button>
            </form>
        </div>
      );
}

export default Login
