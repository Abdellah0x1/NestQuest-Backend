const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError')
const rateLimit = require('express-rate-limit')
const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
//requiring routes
const propertyRouter = require('./routes/propertyRouter');
const userRouter = require('./routes/userRouter')

const errorController = require('./controllers/errorController');

const app = express();


//app middlewares
//adding HTTP security headers
app.use(helmet())

//rate limiting
const limiter =rateLimit({
    max: 100,
    window: 60 * 60 * 1000,
    message: 'Too many requests from this IP'
})

app.use('/api',limiter)

//preventing NoSQL query Injection

app.use(mongoSanitize())

//preventing XSS
app.use(xss())



if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json())


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


