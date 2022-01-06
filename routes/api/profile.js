const express = require('express');
const request = require('request')
const config = require('config')
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator') //express-validator/check

const Profile = require('../../models/Profile'); 
const User = require('../../models/User'); 

//@route    GET api/profile/me  
//@desc     Get current users profile
//@access   Private -- se necesita autenticación
router.get('/me', auth, async (req, res) => {
    try{
        //.populate() - lets you reference documents in other collections.
        const profile = await Profile.findOne({user: req.user.id}).populate('user',
        ['name', 'avatar']); // call the model, busca por usuario (modelo Profile), devuelve nombre y avatar

        if(!profile){
            return res.status(400).json({msg: 'No existe perfil para el usuario'});
        }

        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/profile
//@desc     Create or update user profile
//@access   Private -- se necesita autenticación
router.post('/', [auth, [
    check('status', 'El estado es requerido').not().isEmpty(),
    check('skills', 'Las habilidades son requeridas').not().isEmpty()
]], 
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    // req = user id asignado por la BD
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook, 
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Construir el perfil
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // social object 
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({user: req.user.id}); // busca por id si existe

        //Update
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, // dato a actualizar
                {$set: profileFields},  
                {new: true} 
            );

            return res.json(profile);
        }

        //Create
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public  --no se necesita autenticación
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/profile/user/user_id
//@desc     Get profile by user ID 
//@access   Public  --no se necesita autenticación
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        
        if(!profile) return res.status(400).json({msg: 'Perfil no encontrado'});
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'Perfil no encontrado'});
        }
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/profile
//@desc     Delete profile, user and posts
//@access   Private -- se necesita autenticación
router.delete('/', auth, async (req, res) => {
    try {
        //@todo     Remove users posts

        // Remove Profile
        await Profile.findOneAndRemove({user: req.user.id});
        // remove user 
        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg: 'Usuario eliminado'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private -- se necesita autenticación
router.put('/experience', [auth, [
    check('title', 'El titulo es requerido').not().isEmpty(),
    check('company', 'Nombre de la Compañía es requerido').not().isEmpty(),
    check('from', 'Fecha de inicio es requerida').not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{
        title,
        company,
        location,
        from,
        to,
        current, 
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current, 
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id}); // token
        profile.experience.unshift(newExp); // newExp at top
        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete experience from profile 
//@access   Private -- se necesita autenticación
router.delete('/experience/:exp_id', auth, async(req, res) =>{
    try {
        const profile = await Profile.findOne({user: req.user.id}); // token

        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id); // busca por exp_id
        //.map devuelve el array de id_exp

        profile.experience.splice(removeIndex,1); // elimina un elemento 

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/profile/education
//@desc     Add profile education
//@access   Private -- se necesita autenticación
router.put('/education', [auth, [
    check('school', 'Establecimiento es requerido').not().isEmpty(),
    check('degree', 'Grado es requerido').not().isEmpty(),
    check('fieldofstudy', 'Campo de estudio es requerido').not().isEmpty(),
    check('from', 'Fecha de inicio es requerida').not().isEmpty(),

]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current, 
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current, 
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id}); // token
        profile.education.unshift(newEdu); // newExp at top
        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete education from profile 
//@access   Private -- se necesita autenticación
router.delete('/education/:edu_id', auth, async(req, res) =>{
    try {
        const profile = await Profile.findOne({user: req.user.id}); // token

        //Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id); // busca por edu_id
        //.map devuelve el array de id_exp

        profile.education.splice(removeIndex,1); // elimina un elemento 

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/profile/github/:username
//@desc     Get user repos from github 
//@access   Public -- se necesita autenticación
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };      

        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200){
               return res.status(404).json({msg: 'Perfil de Github no encontrado'});
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;