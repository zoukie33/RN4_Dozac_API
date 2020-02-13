const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const debug = require('debug')('newgoesportapi:server');
const http = require('http');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const fichesPaysRouter = require('./routes/fichesPays');
const tripsRouter = require('./routes/trips');
const { apiPort, apiPortSsl } = require('./config');

const app = express();
const db = require('./models');
const port = normalizePort(apiPort);

app.set('port', port);

app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, token'
  );
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(__dirname + '/public/apidoc'));
app.use('/auth', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/fichesPays', passport.authenticate('jwt', { session: false }), fichesPaysRouter);
app.use('/trips', passport.authenticate('jwt', { session: false }), tripsRouter);

const server = http.createServer(app);

db.sequelize.sync({ force: false }).then(function() {
  server.listen(port, function() {
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      port,
      port
    );
  });
  server.on('error', onError);
  server.on('listening', onListening);
});

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
