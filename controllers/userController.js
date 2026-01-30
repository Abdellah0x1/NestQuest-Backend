const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')



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


module.exports.getUser = catchAsync(async (req,res,next)=> {
    const user = await User.findById(req.params.id);
    res.send(200).json({
        status: 'success',
        data: {
            user
        }
    })
})