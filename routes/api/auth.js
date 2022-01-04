const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator') //express-validator/check

const User = require('../../models/User');

//@route    GET api/auth 
//@desc     Test route
//@access   Public -- no se necesita autenticación
router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password'); // excepto la contraseña
        res.json(user); // devuelve json con datos del usuario
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); // ruta protegida

//@route    POST api/auth 
//@desc     Login and get token
//@access   Public -- no se necesita autenticación
router.post('/',[
    // validaciones en el post
    check('email', 'Agregar un correo válido').isEmail(),
    check('password', 'La contraseña es requerida').exists()
],
async (req, res) => {
    const errors = validationResult(req); // devuelve un array

    if(!errors.isEmpty()){ // si hay errores
        return res.status(400).json({errors: errors.array()});
    }

    // información del body 
    const {email, password } = req.body;

    try{
        // verificar si el usuario existe   
         let user = await User.findOne({email}); // busca por el correo

         if(!user){ // si no existe, es vacío
            return res.status(400).json({errors: [{msg: 'El usuario ingresado no existe'}]}); // agrega otro campo al array
         }

         // verificar contraseña y correo
         const isMatch = await bcrypt.compare(password, user.password); // compara la coontraseña de la bd y la ingresada

         if(!isMatch){ 
            return res.status(400).json({errors: [{msg: 'Contraseña incorrecta'}]});
         }

        // retornar jsonwebtoken
         const payload = {
             user:{
                 id: user.id // ID mongoDB
             }
         }
    
         jwt.sign(
             payload,
             config.get('jwtSecret'),
             {expiresIn: 360000},
             (err, token) => {
                if(err) throw err;
                res.json({token});
             });

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;