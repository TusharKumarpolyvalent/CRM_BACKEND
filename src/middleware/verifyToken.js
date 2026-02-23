const jwt = require('jsonwebtoken');
const JWT_SECRET = 'process.env.JWT_SECRET';

const verifyToken = (req, res, next) => {
  // Header se token nikalna: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // User ki info request mein save kar li
    next(); // Agle step par jao
  } catch (err) {
    res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};

module.exports = verifyToken;
