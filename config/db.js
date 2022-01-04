// mongo connection

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); // obtiene todos los valores del json  


// connect mongodb, devuelve una promesa
const connectDB = async () => {
    try{
        await mongoose.connect(db);

        console.log('MongoDB connected...');
    } catch(err){
        console.error(err.message);
        // exit process with failure 
        process.exit(1);
    }
}

module.exports = connectDB;