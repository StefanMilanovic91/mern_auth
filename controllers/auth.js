const User = require('../models/User');
const ErrorResponse = require('../auxiliary/errorResponse');
const crypto = require('crypto');
const sendMail = require('../auxiliary/sendEmail');


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

exports.forgotpassword = async (req, res, next) => {
    
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return next(new ErrorResponse('Email could not be sent', 404));

        const resetToken = user.getResetToken();
        
        await user.save();

        const resetUrl = `http://localhost:3000/api/auth/passwordreset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset.</h1>
            <p>PLease go to this link to reset password!</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendMail({
                to: user.email,
                subject: 'Password reset request',
                text: message
            });

            res.status(200).json({
                success: true,
                data: 'Email sent.'
            })

        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse('Email could not be sent.', 500));
        }

    } catch (error) {
        return next(error);
    }

};

exports.resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return next(new ErrorResponse('Invalid Reset Token', 400));

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res.status(201).json({
            success: true,
            data: 'Reset Success!'
        })

    } catch (error) {
        next(error);
    }

};


const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token });
}