import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/routing/PrivateRoute';

import PrivateView from './components/PrivateView/PrivateView';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

const App = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <Switch>
                    <PrivateRoute exact path="/" component={PrivateView} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/forgotpassword" component={ForgotPassword} />
                    <Route exact path="/passwordreset/:resetToken" component={ResetPassword} />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App
