const app = require('./app')
const dotenv = require('dotenv');
const mongoose = require('mongoose');


//injecting env variables
dotenv.config({path: './config.env'});

//DB connection

const DB = process.env.DATABASE.replace('<db_password>',encodeURIComponent(process.env.DATABASE_PASSWORD))


mongoose.connect(DB).then(con => {
    console.log(con)
    console.log("mongoDB connected successfully.")
})



//running server

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`express litening on port ${port}`);
})