const prisma = require('../config/prisma');

module.exports.createUser = async (userdata) => {
  return await prisma.users.create({
    data: userdata,
  });
};
