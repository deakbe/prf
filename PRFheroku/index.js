const express = require("express");

const cors = require('cors');
const { use } = require("express/lib/application");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const app = express();

const port = process.env.PORT || 3000;
const dbUrl = 'mongodb+srv://usr:psw@prf-cluster.uynqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbUrl);

const whitelist = [//'https://<project_id>.web.app', 
//'https://<project_id>.firebaseapp.com', 
'http://localhost:4200'];

var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 
    'Origin', 'Accept']
  };

app.use(cors(corsOptions));

mongoose.connection.on('connected', () => {
    console.log('db csatlakoztatva');
})

mongoose.connection.on('error', (err) => {
    console.log('hiba tortent', err);
})

require('./example.model');
require('./user.model');

const userModel = mongoose.model('user');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));



/*
app.use(cors({origin: function(origin, callback){
    if(whitelist.indexOf(origin) >= 0){
        callback(null, true);
    } else {
        callback(new Error('Cors Error'));
    }
}, credentials: true, methods: "GET,PUT,POST,DELETE,OPTIONS"}));
*/
passport.use('local', new localStrategy(function (username, password, done) {
    userModel.findOne({ username: username }, function (err, user) {
        if (err) return done('Hiba lekeres soran', null);
        if (!user) return done('Nincs ilyen felhasználónév', null);
        user.comparePasswords(password, function (error, isMatch) {
            if (error) return done(error, false);
            if (!isMatch) return done('Hibas jelszo', false);
            return done(null, user);
        })
    })
}));

passport.serializeUser(function (user, done) {
    if (!user) return done('nincs megadva beléptethető felhasználó', null);
    return done(null, user);
});

passport.deserializeUser(function (user, done) {
    if (!user) return done("nincs user akit kiléptethetnénk", null);
    return done(null, user);
});

app.use(expressSession({secret: 'csakvalamitideirokhogylegyenittvalami', resave: true}));
app.use(passport.initialize());
app.use(passport.session());

/*
app.get('/', (req, res, next) => {
    res.send('Hello World!');
    //console.log('a hello world route hivodik meg');
    //next();
})
*/

app.use(express.static(path.join(__dirname, 'public'))).set('views', path.join(__dirname, 'views')).set('view engine', 'ejs').get('/', (req, res) => res.render('pages.index.html'));

app.use('/', require('./routes'));
//app.use('/secondary', require('./routes'));

app.use((req, res, next) => {
    console.log('az a hibakezelő');
    res.status(404).send('A kert eroforras nem talalhato');
})

app.listen(port, () => {
    console.log('The server is running!');
})