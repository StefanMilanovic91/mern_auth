import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './register.css';

const Register = () => {

    const [inputs, setInputs] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();

        const config = {
            header:{
            'Content-Type': 'application/json'
            }
        }

        const body = { ...inputs };

        try {
            const data = await axios.post('/api/auth/register', body, config);

            localStorage.setItem('authToken', data.token);
            history.push('/');
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => setError(null), 5000);
        }

    }

    return (
        <div className="register-screen">
            <form className="register-screen__form">
                <h3 className="register-screen__title">Register</h3>
                {error && <span className="error-message">{ error }</span>}
                <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <input
                        onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                        value={inputs.username} type="text" name="username" placeholder="user Name" required />
                </div>
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
                <button onClick={submit} className="btn btn-primary">SUBMIT</button>
            </form>
        </div>
      );
}

export default Register
