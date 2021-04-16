const User = require('../models/User');
const ErrorResponse = require('../auxiliary/errorResponse');


exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({
            username, email, password
        });

        sendToken(user, 201, res);
        
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide email and password.", 400));
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        // if we don't get user back
        if (!user) {
            return next(new ErrorResponse('Invalid credentials.', 401));
        };

        // check password match
        const isMatch = await user.matchPasswords(password);
        // if don't match
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials.', 401));
        };

        // if match
        sendToken(user, 200, res);
        

    } catch (error) {
        next(error);
    }
};

exports.forgotpassword = (req, res, next) => {
    res.send('Forgot Password Route');
};

exports.resetpassword = (req, res, next) => {
    res.send('Rest Password Route');
};


const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token });
}