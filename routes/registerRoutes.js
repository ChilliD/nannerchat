const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
    res.status(200).render('register');
});

router.post('/', (req, res, next) => {

    let username = req.body.logUsername.trim();
    let password = req.body.logPassword;
    let payload = req.body;

    if (username && password) {

    } else {
        payload.errorMsg = "Please fill in each field";
        res.status(200).render('register', payload);
    }
})

module.exports = router;