const express = require('express');
const router = express.Router();
const gravatar = require ('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator') //express-validator/check

const User = require('../../models/User')

//@route    GET api/users 
//@desc     Test route
//@access   Public -- no se necesita autenticación
router.get('/', (req, res) => res.send('User route'));

//@route    POST api/users 
//@desc     Registro de usuarios
//@access   Public -- no se necesita autenticación
router.post('/',[
    // validaciones en el post
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Include a valid email')
        .isEmail(),
    check('password', 'Enter a password with 6 or more characters')
        .isLength({min: 6})
],
async (req, res) => {
    const errors = validationResult(req); // devuelve un array

    if(!errors.isEmpty()){ // si hay errores
        return res.status(400).json({errors: errors.array()}); // si hay error, termina
    }

    // información del body 
    const {name, email, password } = req.body;

    try{
        // verificar si el usuario existe   
         let user = await User.findOne({email}); // busca por el correo

         if(user){ // no es vacío 
            return res.status(400).json({errors: [{msg: 'El usuario ingresado ya existe'}]}); // agrega otro campo al array
         }

        // asignar un avatar 
         const avatar = gravatar.url(email, {
             s: '200', // default size
             r: 'pg', // rating
             d: 'mm' // agrega imagen default 
         }) // obtiene una imagen a partir del correo 

         user = new User({ 
             name,
             email,
             avatar, 
             password
         }); // de tipo User, contiene el esquema

        // encriptar la contraseña 
         const salt = await bcrypt.genSalt(10); 
         user.password = await bcrypt.hash(password, salt);

         // todo lo que devuelve una promesa es await
         await user.save(); // guarda en la bd 

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