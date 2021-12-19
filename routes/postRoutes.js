const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/:id', (req, res, next) => {

    let payload = {
        pageTitle: 'View Post',
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user),
        postId: req.params.id
    };

    res.status(200).render('postPage', payload);
});

module.exports = router;