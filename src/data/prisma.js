const { PrismaClient } = require("@prisma/client");

const { getLogger } = require("../core/logging");

const logger = getLogger();
logger.info("Connecting to database...");

let prisma = new PrismaClient();

try {
  async () => await prisma.$queryRaw("SELECT 1+1 AS result");
} catch (error) {
  logger.error(error.message, { error }); //
  throw new Error("Could not initialize the data layer"); //
}
logger.info("Successfully initialized connection to the database");

async function shutdownData() {
  logger.info("Closing database connection...");
  await prisma.$disconnect();
  logger.info("Successfully closed database connection");
}

module.exports = prisma;
module.exports.shutdownData = shutdownData;
