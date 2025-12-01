const { findUser } = require('../services/Auth.service');

module.exports.userLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    const loggedInUser = await findUser(id);
    if (!loggedInUser) {
      res.status(404).json({
        message: 'User not found',
        data: null,
      });
    }
    if (password === loggedInUser.password) {
      res.status(201).json({
        message: 'User login successfully',
        data: loggedInUser,
      });
    } else {
      res.status(201).json({
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
