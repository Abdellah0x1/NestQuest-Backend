const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Property = require('../models/propertyModel')



//injecting env variables
dotenv.config({path: './config.env'});

//DB connection

const DB = process.env.DATABASE.replace('<db_password>',encodeURIComponent(process.env.DATABASE_PASSWORD))


mongoose.connect(DB).then(con => {
    console.log(con)
    console.log("mongoDB connected successfully.")
})

const properties = JSON.parse(fs.readFileSync(`./dev-data/data/properties.json`)
)


async function importData(){
    try {
        await Property.create(properties);
        console.log('data imported to mongo successfully')
        process.exit();
    }catch(err){
        console.log(err)
    }
}

async function deleteData(){
    try {
        await Property.deleteMany()
        console.log('data deleted successfully')
        process.exit()
    }catch(err){
        console.log(err)
    }
}

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData()