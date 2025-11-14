const {
  validatePhone,
  validatePassword,
  validateEmail,
} = require('../utils/Constant');

module.exports.createUser = (req, res) => {
  try {
    const { userPhone, userPassword, lastName, firstName, userEmail, role } =
      req.body;
    console.log('first name : ', firstName, firstName.length, typeof firstName);

    if (!validatePhone(userPhone) || typeof userPhone !== 'string')
      throw new Error('Please enter a valid phone');

    if (!validatePassword(userPassword) || typeof userPassword !== 'string')
      throw new Error(
        'Password must contain at least 6 characters, starting with an uppercase and one special character'
      );

    if (
      firstName.length < 3 ||
      firstName.length > 20 ||
      typeof firstName !== 'string'
    )
      throw new Error(
        'First name must be minimum 3 characters and maximum 20 characters long only'
      );

    if (lastName.length > 20 || typeof lastName !== 'string')
      throw new Error('Last name must be maximum 20 characters long');

    if (!validateEmail(userEmail) || typeof userEmail !== 'string')
      throw new Error('Please enter a valid email');

    if (role.length < 3 || role.length > 20 || typeof role !== 'string')
      throw new Error(
        'Role must be minimum 3 characters and maximum 20 characters long'
      );

    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  } finally {
    res.end();
  }
};
