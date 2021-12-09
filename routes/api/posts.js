const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {

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

module.exports = router;