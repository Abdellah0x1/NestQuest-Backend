const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

module.exports.getAllUsers= catchAsync(async (req,res,next)=> {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})


module.exports.updateMe = async (req,res,next)=>{
    // check for body contains password or passwordConfirm
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for updating password. Please use /updateMe',400))
    }
    // getting email and name from the body
    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody,{
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        updatedUser
    })
}

module.exports.deleteMe = catchAsync(async (req,res,next)=>{
    const {user} = req
    await User.findByIdAndUpdate(user.id, {active: false});
    res.status(204).json({
        status: 'sucess',
        data: null
    })
})

module.exports.getMe = (req,res,next)=>{
    res.status(200).json({
        status: 'sucess',
        data: {
            user: req.user
        }
    })
}

module.exports.getUser = catchAsync(async (req,res,next)=> {
    const user = await User.findById(req.params.id);
    res.send(200).json({
        status: 'success',
        data: {
            user
        }
    })
})