const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
    res.status(200).render('login');
});

router.post('/', async (req, res, next) => {

    let username = req.body.logUsername.trim();
    let password = req.body.logPassword;
    let payload = req.body;

    if (username && password) {
        let user = await User.findOne({ username: username })
        .catch((error) => {
            console.log(error);
            payload.errorMsg = "Something went wrong";
            res.status(200).render('login', payload);
        });

        if (user != null) {
            let result = await bcrypt.compare(password, user.password);
            
            if (result === true) {
                req.session.user = user;
                return res.redirect('/');
            }
        }

        payload.errorMsg = "Login failed";
        return res.status(200).render('login', payload);
    }
    payload.errorMsg = "Please fill out each field";
    res.status(200).render('home');
});

module.exports = router;