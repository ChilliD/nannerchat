const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const middleware = require('./middleware');
const bodyParser = require('body-parser');
const mongoose = require('./database');


app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

//Routes
const loginRoute = require('./routes/loginRoutes.js');
const registerRoute = require('./routes/registerRoutes.js');

app.use('/login', loginRoute);
app.use('/register', registerRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {

    let payload = {
        pageTitle: 'Home'
    };

    res.status(200).render('home', payload);
});


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening at ${PORT}`)
});