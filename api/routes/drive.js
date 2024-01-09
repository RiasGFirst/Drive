const bodyParser = require('body-parser');
const database = require('../sys/database')
const jwt = require('../sys/jwtUtils');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get("/", jwt.checkAuth, (req, res, next) => {
    const userData = req.session.user;
    res.status(200).json({
        message: `Welcome To Drive ${userData.username}!`
    });
});


module.exports = router;
