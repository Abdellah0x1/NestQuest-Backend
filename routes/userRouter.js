const express = require('express');
const {signup,login,logout} = require('../controllers/authController')
const userRouter = express.Router('/users')
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');


//auth and signup , logout routes
userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.post('/logout',logout)

//password reset
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword/:token', authController.resetPassword);

//updating user password
userRouter.patch('/updatePassword', authController.protect, authController.updatePassword)
//deleting user
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe)

userRouter.patch('/updateMe', authController.protect, userController.updateMe )

userRouter.get('/getMe',authController.protect,userController.getMe)
//getting users
userRouter.route('/').get(userController.getAllUsers);
userRouter.route('/:id').get(userController.getUser);

//getting current user

module.exports = userRouter;