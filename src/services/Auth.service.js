const prisma = require('../config/prisma');

module.exports.findUser = async (id) => {
  return prisma.Users.findUnique({
    where: { id: id },
  });
};
