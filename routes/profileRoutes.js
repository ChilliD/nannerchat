const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async (req, res, next) => {

    let payload = await getPayload(req.session.user.username, req.session.user);

    res.status(200).render('profilePage', payload);
});

router.get('/:username', async (req, res, next) => {

    let payload = await getPayload(req.params.username, req.session.user);

    res.status(200).render('profilePage', payload);
});

async function getPayload(username, userLoggedIn) {
    let user = await User.findOne({ username: username })

    if (!user) {
        return {
            pageTitle: "Not Found",
            userLoggedIn: userLoggedIn,
            userLoggedInClient: JSON.stringify(userLoggedIn)
        }
    }

    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInClient: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}

module.exports = router;