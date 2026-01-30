const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError')

//requiring routes
const propertyRouter = require('./routes/propertyRouter');
const userRouter = require('./routes/userRouter')

const errorController = require('./controllers/errorController');

const app = express();

//auth middlewares



//app middlewares

app.use(express.json())
app.use(morgan('dev'));


app.use((req,res,next)=> {
    req.requestDate = new Date().toISOString();
    next();
})


//routes

app.use('/api/v1/properties',propertyRouter);
app.use('/api/v1/users',userRouter) 

//global error handeling

app.all(/.*/,(req,res,next)=> {
    next(new AppError(`can't find ${req.originalUrl}`,404))
})


app.use(errorController)

module.exports = app;   


