const Prisma = require("@prisma/client");

const ServiceError = require("../core/serviceError");
const handleDBError = (error) => {
  const { code, meta, message } = error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //P2002: "Unique constraint failed on the {constraint}"
    if (code === "P2002") {
      switch (true) {
        case message.includes("maand_vegie"):
          return ServiceError.validationFailed(
            "Een suggestieVanDeMaand voor deze maand en vegie optie bestaat reeds.",
            meta
          );
        case message.includes("email"):
          return ServiceError.validationFailed(
            "Een medewerker met die mailadres bestaat reeds.",
            meta
          );
        default:
          return ServiceError.validationFailed("Dit item bestaat reeds", meta);
      }
    }
    //P2003: "Foreign key constraint failed on the field: {field_name}"
    if (code === "P2003") {
      switch (true) {
        case message.includes("medewerkerId"):
          return ServiceError.notFound("This user bestaat niet", meta);
        case message.includes("suggestieVanDeMaandId"):
          return ServiceError.notFound(
            "SuggestieVanDeMaandId bestaat niet",
            meta
          );
        case message.includes("leverplaatsId"):
          return ServiceError.notFound("LeverplaatsId bestaat niet", meta);
        case message.includes("bestellingsnr"):
          return ServiceError.notFound("Bestellingsnr bestaat niet", meta);
      }
    }
    //P2025: "Record does not exist"
    if (code === "P2025") {
      switch (true) {
        case message.includes("bestelling"):
          return ServiceError.notFound("Bestelling bestaat niet", meta);
        case message.includes("medewerker"):
          return ServiceError.notFound("Medewerker bestaat niet", meta);
        case message.includes("dienst"):
          return ServiceError.notFound("Dienst bestaat niet", meta);
          
      }
    }

    // Return error because we don't know what happened
    return error;
  }
  if(error instanceof Prisma.PrismaClientInitializationError){
    return ServiceError.connectionFailed("Geen connectie met de databank.",meta);
  }
  if (
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    //mogelijke afhandeling voor andere prisma errors kunnen hier worden toegevoegd
    return error;
  } 
   // Return error because we don't know what happened (not a PrismaClientKnownRequestError)
  else {
    return error;
  }
};

module.exports = handleDBError;
