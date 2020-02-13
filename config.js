const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mysqlHost: process.env.MYSQL_HOST,
  nodeEnv: process.env.NODE_ENV,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  mysqlQLimit: process.env.MYSQL_QUEUE_LIMIT,
  mysqlCoLimit: process.env.MYSQL_CO_LIMIT,
  apiPort: process.env.API_PORT,
  apiPortSsl: process.env.API_PORTSSL,
  secret: process.env.SECRET,
  sender: process.env.SENDER_MAIL,
  emailPass: process.env.MAIL_PASSWORD,
  tlsRej: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  debugLogging: process.env.DEBUG_LOGGING,
  dirname: __dirname
};
