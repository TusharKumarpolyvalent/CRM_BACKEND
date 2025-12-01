const prisma = require('../config/prisma');

module.exports.findUser = async (id) => {
  return prisma.users.findUnique({
    where: { id: id },
  });
};
