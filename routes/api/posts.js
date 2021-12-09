const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
    Post.find()
    .populate('postedBy')
    .sort({ 'createdAt': -1 })
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.post('/', async (req, res, next) => {
    
    if (!req.body.content) {
        console.log("No Content");
        return res.sendStatus(400);
    }

    let postData = {
        content: req.body.content,
        postedBy: req.session.user
    };

    Post.create(postData)
    .then(async post => {
        post = await User.populate(post, { path: 'postedBy' });
        res.status(201).send(post);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.put('/:id/like', async (req, res, next) => {

    let postId = req.params.id;
    let userId = req.session.user._id;
    let isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
    let option = isLiked ? '$pull' : '$addToSet';

    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });

    let post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });

    res.status(200).send(post);
});


module.exports = router;