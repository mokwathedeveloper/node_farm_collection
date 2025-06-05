const jwt = require('jsonwebtoken');

// Use environment variable with a fallback (for development only)
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set in environment variables. Using default secret for development only.');
}

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      status: 'fail',
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'your_jwt_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      status: 'fail',
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = { verifyToken, JWT_SECRET };
