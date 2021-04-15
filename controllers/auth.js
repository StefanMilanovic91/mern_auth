const User = require('../models/User');


exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({
            username, email, password
        });

        res.status(201).json({
            status: true,
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
};

exports.login = async (req, res, next) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Please provide email and password."});
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        // if we don't get user back
        if (!user) {
            return res.status(400).json({ success: fasle, error: 'Invalid credentials.' });
        };

        // check password match
        const isMatch = await user.matchPasswords(password);
        // if don't match
        if (!isMatch) {
            return res.status(404).json({ success: false, error: 'Invalid credentials.' });
        };

        // if match
        res.status(200).json({
            status: true,
            token: 'aklwuhdakiuwhdui21uhu3hiubi1uhreuh'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
};

exports.forgotpassword = (req, res, next) => {
    res.send('Forgot Password Route');
};

exports.resetpassword = (req, res, next) => {
    res.send('Rest Password Route');
};