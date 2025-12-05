const prisma = require('../config/prisma');

module.exports.createActivity = async (data) => {
  return prisma.Activity.create({
    data: data,
  });
};
