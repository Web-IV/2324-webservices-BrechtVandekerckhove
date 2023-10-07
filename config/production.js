module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:5173"], //URL van de frontend
    maxAge: 3 * 60 * 60,
  },
};
