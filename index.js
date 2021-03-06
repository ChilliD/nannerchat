const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const middleware = require('./middleware');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');


app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use(session({ 
    secret: 'has nannerz',
    resave: true,
    saveUninitialized: false
}));

//Routes
const loginRoute = require('./routes/loginRoutes.js');
const registerRoute = require('./routes/registerRoutes.js');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');
const logoutRoute = require('./routes/logout');

//API Routes
const postsAPIRoute = require('./routes/api/posts');

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/post', middleware.requireLogin, postRoute);
app.use('/profile', middleware.requireLogin, profileRoute);
app.use('/logout', logoutRoute);

app.use('/api/posts', postsAPIRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {

    let payload = {
        pageTitle: 'Home',
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user)
    };

    res.status(200).render('home', payload);
});


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening at ${PORT}`)
});