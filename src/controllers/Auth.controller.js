const jwt = require('jsonwebtoken');
const { findUser } = require('../services/Auth.service');

// Secret key ko .env mein hona chahiye, lekin abhi testing ke liye yahan rakh sakte hain
const JWT_SECRET = 'process.env.JWT_SECRET';

module.exports.userLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    const loggedInUser = await findUser(id);

    // 1. Check if user exists
    if (!loggedInUser) {
      return res.status(404).json({
        message: 'User not found',
        data: null,
      });
    }

    // 2. Password match check karein
    if (password === loggedInUser.password) {
      // 3. JWT Token banayein (Yeh sabse important step hai)
      const token = jwt.sign(
        {
          id: loggedInUser.id,
          role: loggedInUser.role,
          name: loggedInUser.name,
        },
        JWT_SECRET,
        { expiresIn: '24h' } // Token 24 ghante tak valid rahega
      );

      // 4. Token aur User data saath mein bhejein
      res.status(200).json({
        message: 'User login successfully',
        token: token, // Frontend ko ye token save karna hoga
        data: {
          id: loggedInUser.id,
          name: loggedInUser.name,
          role: loggedInUser.role,
        },
      });
    } else {
      res.status(401).json({
        message: 'Invalid credentials',
        data: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during user login',
      error: err.message,
    });
  }
};
