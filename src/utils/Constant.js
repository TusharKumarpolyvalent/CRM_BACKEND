const { phoneRegex, passwordRegex, emailRegex } = require('./Regex');

module.exports.uniqueId = () => Date.now();
module.exports.validatePhone = (phoneNo) => phoneRegex.test(phoneNo);
module.exports.validatePassword = (password) => passwordRegex.test(password);
module.exports.validateEmail = (email) => emailRegex.test(email);
