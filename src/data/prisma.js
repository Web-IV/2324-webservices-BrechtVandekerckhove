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


module.exports = prisma;

/*
You do not need to explicitly $disconnect() 
CONCEPT
in the context of a long-running application that is continuously 
serving requests. Opening a new connection takes time and can slow down your
application if you disconnect after each query.
*/
