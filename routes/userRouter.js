const express = require('express');
const {signup,login} = require('../controllers/authController')
const userRouter = express.Router('/users')
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');


//auth and signup routes
userRouter.post('/signup',signup)
userRouter.post('/login',login)

//password reset
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword/:token', authController.resetPassword);

//updating user password
userRouter.patch('/updatePassword', authController.protect, authController.updatePassword)
//deleting user
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe)

userRouter.patch('/updateMe', authController.protect, userController.updateMe )

//getting users
userRouter.route('/').get(userController.getAllUsers);
userRouter.route('/:id').get(userController.getUser);

//getting current user
userRouter.get('/getMe',authController.protect,userController.getMe)

module.exports = userRouter;