const Koa = require("koa");
const winston = require("winston");
const config = require("config");
const bodyParser = require("koa-bodyparser");
const installRest = require('./rest')

const NODE_ENV = config.get("env");
const LOG_LEVEL = config.get("log.level");
const LOG_DISABLED = config.get("log.disabled");

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`);

const app = new Koa();

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console({ silent: LOG_DISABLED })],
});

app.use(bodyParser());


app.use(async (ctx, next) => {
  logger.info(JSON.stringify(ctx.request));
  logger.info(JSON.stringify(ctx.request.body));
  ctx.body = "Hello World";
  return next();
});

installRest(app);

app.listen(9000, () => {
  logger.info("🚀 Server listening on http://localhost:9000");
});
