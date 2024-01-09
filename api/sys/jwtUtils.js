const jwt = require('jsonwebtoken');
require('dotenv').config();


const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }
  
    try {
      // Verify the JWT token
      const decoded = await verifyToken(token);
  
      // Attach the decoded data to the request for further use
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
  
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid JWT token' });
    }
  };


//Generate a Token
function generateToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'default-jwt-secret',
        { expiresIn: '1h' }
    );
}

  
// Function to verify a JWT token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'default-jwt-secret', (err, decoded) => {
          if (err) {
              reject(err);
          } else {
              resolve(decoded);
          }
        });
    });
}





module.exports = {
  checkAuth,
  generateToken,
  verifyToken,
};