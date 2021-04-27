import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './privateView.css';


const PrivateView = () => {

    const [error, setError] = useState(null);
    const [privateData, setPrivateData] = useState('');
    const history = useHistory();

    useEffect(() => {
        
        fetchPrivateData();
    }, []);
    
    const fetchPrivateData = async () => {
        
        const config = {
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }
        
        try {
            const { data } = await axios.get('/api/private', config);
            
            setPrivateData(data.data);
        } catch (error) {
            
            localStorage.removeItem('authToken');
            setError('You ar not authorized, please login!');
        }

    } 

    const logoutHandler = () => {
        localStorage.removeItem('authToken');
        history.push('/login');
    }

    return (
        <>
            {
                error ? <span className="error-message">{error}</span> :
                
                <> <div style={{ background: 'green', color: 'white' }}>
                    {privateData}
                    </div>
                    <button onClick={logoutHandler} className="btn">Logout</button>
                </>
                
            }
        </>
    ) 
            
}

export default PrivateView
