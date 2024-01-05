const accountRoute = require('./api/routes/account');
const keys = require('./api/sys/keys');
const session = require('express-session');
const bodyParser = require('body-parser')
const express = require('express');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: keys.session_secret, // Replace with a secure session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
}));

app.use("/account", accountRoute);



module.exports = app;