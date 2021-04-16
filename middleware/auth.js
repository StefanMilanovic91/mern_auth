const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../auxiliary/errorResponse');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to acces this route.', 401));
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorResponse('No user found with this Id.', 404));
        }

        req.user = user;
        next();

    } catch (error) {
        return next(new ErrorResponse('Not authorized to acces this route.', 401))
    }

}