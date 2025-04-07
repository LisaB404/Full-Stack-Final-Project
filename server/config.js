const mongoose = require('mongoose')

// CONNTECTION TO DATABASE MONGODB
require('dotenv').config();
const MONGO_KEY = process.env.MONGO_KEY
const MONGO_USERNAME = process.env.MONGO_USERNAME

mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_KEY}@cluster0.9an9rco.mongodb.net/Login-final?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log('Connected to database.');
})
.catch((error)=>{
    console.log('Connection failed.', error);
})