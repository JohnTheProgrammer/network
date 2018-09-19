module.exports = (function() {
  var express = require('express');
  var session = require('express-session');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var morgan = require('morgan');
  var endpoint = require('./endpoints.js');

  var url = express.Router();
  url.use(morgan('dev'));
  url.use(bodyParser.json());
  url.use(bodyParser.urlencoded({ extended: true }));
  url.use(cookieParser());

  url.use(express.static('public'));

  url.use(session(
    {secret: '>4Zq;({+>&GQ2q*?+Ih&wmsh2Vu]t3',
    resave: true,
    saveUninitialized: false}));

  url.get('/',              (req, res) => { res.sendFile(__dirname + '/public/home.html'); });
  url.get('/account/:id',   (req, res) => { res.sendFile(__dirname + '/public/account.html'); });
  url.get('/explore',       (req, res) => { res.sendFile(__dirname + '/public/explore.html'); });
  url.get('/inbox',         (req, res) => { res.sendFile(__dirname + '/public/inbox.html'); });
  url.get('/message/:id',   (req, res) => { res.sendFile(__dirname + '/public/message.html'); });
  url.get('/notifications', (req, res) => { res.sendFile(__dirname + '/public/notifications.html'); });
  url.get('/view/:id',      (req, res) => { res.sendFile(__dirname + '/public/view.html'); });
  url.get('/login',         (req, res) => { res.sendFile(__dirname + '/public/login.html'); });
  url.get('/signup',        (req, res) => { res.sendFile(__dirname + '/public/signup.html'); });

  return url;
})();
