const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

module.exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            newUser
        }
    })
})


module.exports.login = catchAsync(async (req,res,next) => {
    const {email, password} = req.body;
    //check that both email and password are provided
    if(!email || !password) return next(new AppError("Please Enter your password and email",400))
    //check if user exists and if password is valid
    const user = await User.findOne({email}).select('+password')
    const correct = await user.correctPassword(password, user.password);
    if(!user || !correct){
        return next(new AppError("Incorrect email or password",401))
    }

    //send token
    const token = signToken(user._id);
    
    res.status(200).json({
        status: 'sucess',
        token
    })
})

//middlewares for protected routes

module.exports.protect = catchAsync(async (req,res,next)=>{
    //check if token exists
    let token 
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token){
        return next(new AppError('You are not logged in! please log in to get access',401 ))
    }
    //check if token is valid
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if user exists
    const currUser = await User.findById(decoded.id);
    if(!currUser) return next(new AppError("The user belongig to this token no longer exists",401))
    //check if password was changed after token was issued
    if(currUser.passwordChangedAfter(token.iat)) return next(new AppError("User Recently Changed password! Please Log in again"),401)
    //grant access
    req.user = currUser;
    next()
})


//authorization 
module.exports.restrictTo = (...roles)=> ((req,res,next)=>{
    if(!roles.includes(req.user.role)) return next(new AppError("You don't have permissions to perform this action",403))
    next();
})


//reset password

module.exports.forgotPassword =catchAsync(async (req,res,next)=> {
    //check if email is related to a valid  user
    const user = await User.findOne({email: req.body.email})
    if(!user) return next(new AppError("there is no user with this email",404))
    //generate token
    const token  = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    //send token
    const resetURL = `${req.protocol}://${req.get('host')}/${token}`;
    const message = `Forgot your password? Sumbit a patch request with your new password and passwordConfirm to ${resetURL} \nIf you didn't foget your password then please just ignore this email!`;
    
    try {
        await sendEmail({
        email: req.body.email,
        subject: 'Your password reset token (valid 10min)',
        message
        })

        res.status(200).json({
            status: 'success',
            message: 'email sent to user'
        })
    }catch(err){
        console.log('MAILTRAP ERROR:', err),
        this.passwordResetToken = undefined;
        this.passwordResetExpires = undefined;
        return next(new AppError("there was an error sending the email try again later!",500))
    }
    
})

module.exports.resetPassword = catchAsync(async (req,res, next)=>{
    //getting user based on the token

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: req.params.token, passwordResetExpires: {$gt: Date.now()}});
    if(!user) return next(new AppError("Token is invalid or expired",401));

    //
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })
})