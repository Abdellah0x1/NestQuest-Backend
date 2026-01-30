const AppError = require("../utils/AppError");


const handleJWTError = ()=> new AppError("Invalid Token please log in again.",401);

const handleJWTExpired = ()=> new AppError("your token has been expired please log in again.",401)

const sendErrDev = (err,res)=> {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
        });
}

const sendErrProd = (err,res)=> {
    //only send operational errors
    if(err.isOperational === true){
        res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
    }else {
        console.log(err)
        res.status(500).json({
            status: 'error',
            messsage: 'something went very wrong !'
        })
    }
}

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if(process.env.NODE_ENV == 'development'){
        sendErrDev(err,res)
    }else if(process.env.NODE_ENV == 'production') {
        const error = {...err};
        if(error.name == 'JsonWebTokenError') error = handleJWTError();
        if(error.name == 'TokenExpiredError') error = handleJWTExpired();
        sendErrProd(error,res);
    }
}