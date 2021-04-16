const ErrorResponse = require('../auxiliary/errorResponse');

const errorHendler = (err, req, res, next) => {
    const error = { ...err };

    error.message = err.message;

    //console.log(err);

    if (err.code === 11000) {
        const message = 'Duplicate Field Enter';
        error = new ErrorResponse(message, 400);
    }

    if (err.code === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });

};

module.exports = errorHendler;