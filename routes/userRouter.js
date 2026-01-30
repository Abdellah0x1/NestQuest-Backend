const express = require('express');
const {signup,login} = require('../controllers/authController')
const userRouter = express.Router('/users')
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');


//auth and signup routes
userRouter.post('/signup',signup)
userRouter.post('/login',login)


userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassowrd/:token', authController.resetPassword);


userRouter.route('/').get(userController.getAllUsers);
userRouter.route('/:id').get(userController.getUser);

module.exports = userRouter;