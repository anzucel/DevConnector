//model -> schema 
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});


module.exports = User = mongoose.model('user', UserSchema); // genera la colección usuarios con el formato del esquema
// guarda en la base de datos