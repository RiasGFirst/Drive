const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const db = require('../sys/database');
const keys = require('../sys/keys')
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Your in account page (GET)"
    });
});

router.post("/", (req, res, next) => {
    res.status(200).json({
        message: "Your in account page (POST)"
    });
});


router.get("/login", (req, res, next) => {
    res.status(200).json({
        message: "Your on the login page (GET)"
    });
});


router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists in the database
    const sql = 'SELECT * FROM users WHERE email = ?;';
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

            // Compare the provided password with the hashed password from the database
        const isPasswordValid = await bcrypt.compare(password, result[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: result[0].id, email: result[0].email }, keys.token_secret, { expiresIn: '1h' });

        res.status(200).json({
            userID: result[0].id,
            username: result[0].username,
            email: result[0].email,
            storage: result[0].storage,
            token
        });
    });
});


router.get("/login", (req, res, next) => {
    res.status(200).json({
        message: "Your on the login page (GET)"
    });
});


router.get("/register", (req, res, next) => {
    res.status(200).json({
        message: "Your are on register page (GET)"
    })
});


router.post("/register", async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate request
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashPasswd = await bcrypt.hash(password, 10);

    // Insert user into the database
    const sql = 'INSERT INTO users (username, email, password, uuid, storage) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [username, email, hashPasswd, uuidv4(), '500'], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.status(201).json({ message: 'User registered successfully' });
    })
});



module.exports = router;
