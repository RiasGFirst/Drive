const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const database = require('../sys/database')
const jwt = require('../sys/jwtUtils');
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
    res.status(200).json({message: "Hello!"});
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    database.authenticateUser(email, password, async (err, authenticationResult) => {
      if (err) {
        console.error('Error authenticating user:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (!authenticationResult.userExists) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      if (!authenticationResult.passwordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const { user } = authenticationResult;

      // Set the user as authenticated in the session
      req.session.isAuthenticated = true;
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        uuid: user.uuid,
        storage: user.storage,
      };

      const jwtToken = jwt.generateToken(user);
      res.set('Authorization', `Bearer ${jwtToken}`);
  
      // Respond with user details or token
      res.status(200).json({
        userID: user.id,
        username: user.username,
        email: user.email,
        uuid: user.uuid,
        storage: user.storage,
        token: jwtToken
      });
    });
  });

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    database.registerUser(username, email, password, uuidv4(), "500", async (err, registrationResult) => {
        if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (!registrationResult.registrationSuccessful) {
        return res.status(400).json({ message: 'Registration failed' });
        }

        // You can customize the response based on your needs
        res.redirect('/account/login');
    });
});



module.exports = router;
