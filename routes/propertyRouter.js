const { getAllProperties, getProperty,addProperty, updateProperty, deleteProperty, aliasTopRated } = require('../controllers/propertyController')

const express = require('express');
const authController = require('../controllers/authController')

const propertyRouter = express.Router();


propertyRouter.route('/top-rated').get(aliasTopRated, getAllProperties)

propertyRouter.route('/').get(authController.protect,getAllProperties).post(authController.protect,addProperty)
propertyRouter.route('/:id').get(getProperty).patch(authController.protect,updateProperty).delete(authController.protect,authController.restrictTo('admin'),deleteProperty)


module.exports = propertyRouter;