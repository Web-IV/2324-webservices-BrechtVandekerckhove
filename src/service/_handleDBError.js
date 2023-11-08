const ServiceError = require("../core/serviceError");
const Prisma = require("@prisma/client");
const handleDBError = (error) => {
  const { code, meta, message } = error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //users nog toevoegen
    //P2002: "Unique constraint failed on the {constraint}"
    if (code === "P2002") {
      switch (true) {
        case message.includes(
          "suggestievandemaand.SuggestieVanDeMaand_maand_vegie_key"
        ):
          return ServiceError.validationFailed(
            "A suggestieVanDeMaand for this month and vegie option already exists",
            meta
          );
        default:
          return ServiceError.validationFailed(
            "This item already exists",
            meta
          );
      }
    }
    //P2003: "Foreign key constraint failed on the field: {field_name}"
    if (code === "P2003") {
      switch (true) {
        case message.includes("medewerkerId"):
          return ServiceError.notFound("This user does not exist", meta);
        case message.includes("suggestieVanDeMaandId"):
          return ServiceError.notFound(
            "suggestieVanDeMaandId does not exist",
            meta
          );
        case message.includes("leverplaatsId"):
          return ServiceError.notFound("leverplaatsId does not exist", meta);
        case message.includes("bestellingsnr"):
          return ServiceError.notFound("bestellingsnr does not exist", meta);
      }
    }
    // Return error because we don't know what happened
    return error;
  }
  if (
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    // Return error because we don't know what happened (not a PrismaClientKnownRequestError)
    //mogelijke afhandeling voor andere prisma errors kunnen hier worden toegevoegd
    return error;
  } else {
    return error;
  }
};

module.exports = handleDBError;
