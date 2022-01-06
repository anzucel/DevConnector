const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const {check, validationResult} = require('express-validator') //express-validator/check

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route    POST api/posts 
//@desc     create a post
//@access   Private -- no se necesita autenticación
router.post('/', [auth, [
    check('text', 'El texto es requerido').not().isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id 
        });

        const post = await newPost.save();

        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/posts 
//@desc     Get all posts
//@access   Private -- no se necesita autenticación
router.get('/', auth, async(req, res) =>{
    try {
        const posts = await Post.find().sort({date: -1}); // del más reciente
        res.json(posts);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    GET api/posts/:id
//@desc     Get post by ID
//@access   Private -- no se necesita autenticación
router.get('/:id', auth, async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id); // del más reciente
        
        if(!post){
            return res.status(404).json({msg: 'Post no encontrado'});
        }
        
        res.json(post);
        
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post no encontrado'});
        }
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/posts/:id
//@desc     Delete a post
//@access   Private -- no se necesita autenticación
router.delete('/:id', auth, async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id); // del más reciente
        
        if(!post){
            return res.status(404).json({msg: 'Post no encontrado'});
        }

        // verificar el autor del post
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }
        
        await post.remove(); 
        res.json({msg: 'Post eliminado'});
        
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post no encontrado'});
        }
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/posts/like/:id
//@desc     Like a post 
//@access   Private -- no se necesita autenticación
router.put('/like/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // verificar si el usuario ha dado like
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){ // si es >0 ya tiene like
            return res.status(400).json({msg: 'Opción no disponible'});
        }
        
        post.likes.unshift({user: req.user.id}); //lo pone al inicio
        
        await post.save();
        res.json(post.likes); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/posts/unlike/:id
//@desc     Unlike a post 
//@access   Private -- no se necesita autenticación
router.put('/unlike/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

       // verificar si el usuario ha dado like
        if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0){ // si es >0 no tiene like
            return res.status(400).json({msg: 'Opción no disponible'});
        }
        
        // remover el like
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        
        await post.save(); 
        res.json(post.likes); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }   
}); 

//@route    POST api/posts 
//@desc     create a post
//@access   Private -- no se necesita autenticación
router.post('/', [auth, [
    check('text', 'El texto es requerido').not().isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id 
        });

        const post = await newPost.save();

        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/posts/comment/:id
//@desc     Comment on a post
//@access   Private -- no se necesita autenticación
router.post('/comment/:id', [auth, [
    check('text', 'El texto es requerido').not().isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id 
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/posts/comment/:id/:comment_id -- post ID and Comment ID
//@desc     Delete a omment on a post
//@access   Private -- no se necesita autenticación
router.delete('/comment/:id/:comment_id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //quitar el comentario del post 
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // si comentario existe
        if(!comment){
            return res.status(404).json({msg: 'Comentario no encontrado'});
        }

        //verificar usuario
        if(comment.user.toString() !== req.user.id){
            return res.status(404).json({msg: 'Usuario no autorizado para la gestión'});
        }

        //eliminar comentario
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);

        await post.save();
        
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
 
module.exports = router;