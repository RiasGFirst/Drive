const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');"drivetest"
});
"drivetest"

function checkExistingEmail(email, callback) {
  const sql = 'SELECT * FROM users WHERE email = ?;';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return callback(err, null);
    }
    console.log(result.length);
    return callback(null, result.length > 0);
  });
}


function registerUser(username, email, password, uuid, storage, callback) {
  // Check if the email is already in use
  checkExistingEmail(email, async (emailCheckError, emailExists) => {
    if (emailCheckError) {
      return callback(emailCheckError, null);
    }

    if (emailExists) {
      return callback(null, { registrationSuccessful: false, message: 'Email is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const sql = 'INSERT INTO users (username, email, password, uuid, storage) VALUES (?, ?, ?, ?, ?);';
    db.query(sql, [username, email, hashedPassword, uuid, storage], (registerError, result) => {
      if (registerError) {
        return callback(registerError, null);
      }

      // You can customize the response based on the result
      const registrationSuccessful = result.affectedRows > 0;

      return callback(null, { registrationSuccessful, message: registrationSuccessful ? 'Registration successful' : 'Registration failed' });
    });
  });
}


function authenticateUser(email, password, callback) {
  const sql = 'SELECT * FROM users WHERE email = ?;';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.length === 0) {
      return callback(null, { userExists: false });
    }

    const isPasswordValid = await bcrypt.compare(password, result[0].password);

    if (!isPasswordValid) {
      return callback(null, { userExists: true, passwordValid: false });
    }

    return callback(null, {
      userExists: true,
      passwordValid: true,
      user: {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
        uuid: result[0].uuid,
        storage: result[0].storage
      },
    });
  });
}





module.exports = {authenticateUser, registerUser};