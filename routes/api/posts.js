const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res, next) => {
    let results = await getPosts({});
    res.status(200).send(results);
});

router.get('/:id', async (req, res, next) => {
    let postId = req.params.id;
    let postData = await getPosts({ _id: postId });
    postData = postData[0];
    let results = {
        postData: postData
    };

    if (postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({ replyTo: postId });

    res.status(200).send(results);
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

    if (req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
    }

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

router.post('/:id/repost', async (req, res, next) => {
    let postId = req.params.id;
    let userId = req.session.user._id;
    let deletedPost = await Post.findOneAndDelete({ postedBy: userId, repostData: postId })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });

    let option = deletedPost != null ? '$pull' : '$addToSet';
    let repost = deletedPost;

    if (!repost) {
        repost = await Post.create({ postedBy: userId, repostData: postId })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        });
    }

    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { reposts: repost._id } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });

    let post = await Post.findByIdAndUpdate(postId, { [option]: { repostUsers: userId } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });

    res.status(200).send(post);
});

async function getPosts(filter) {
    let results = await Post.find(filter)
    .populate('postedBy')
    .populate('repostData')
    .populate('replyTo')
    .sort({ 'createdAt': -1 })
    .catch(error => console.log(error));

    
    results = await User.populate(results, { path: "replyTo.postedBy" });
    return await User.populate(results, { path: "repostData.postedBy" });
}

/* OLD GET POSTS
Post.find()
.populate('postedBy')
.populate('repostData')
.sort({ 'createdAt': -1 })
.then(async results => {
    results = await User.populate(results, { path: "repostData.postedBy" });
    res.status(200).send(results);
})
.catch(error => {
    console.log(error);
    res.sendStatus(400);
}) 
*/


module.exports = router;