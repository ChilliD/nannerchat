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
    res.status(200).render('register');
});

router.post('/', async (req, res, next) => {

    let username = req.body.username.trim();
    let password = req.body.password;
    let payload = req.body;

    if (username && password) {
        let user = await User.findOne({ username: username })
        .catch((error) => {
            console.log(error);
            payload.errorMsg = "Something went wrong";
            res.status(200).render('register', payload);
        });

        if (user == null) {
    
            let data = req.body;

            data.password = await bcrypt.hash(password, 10);

            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect('/');
            })

        } else {
            payload.errorMsg = "Username already exists";
            res.status(200).render('register', payload);
        }

    } else {
        payload.errorMsg = "Please fill in each field";
        res.status(200).render('register', payload);
    }
})

module.exports = router;