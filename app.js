const accountRoute = require('./api/routes/account');
const session = require('express-session');
const bodyParser = require('body-parser')
const express = require('express');
const jwtUtils = require('./api/sys/jwtUtils')
require('dotenv').config();
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "default-secret-session", // Replace with a secure session secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
}));

app.use("/account", accountRoute);



module.exports = app;