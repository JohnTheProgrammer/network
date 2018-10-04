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

  url.get('/',                    (req, res) => { res.sendFile(__dirname + '/public/view.html'); });
  url.get('/account',             (req, res) => { res.sendFile(__dirname + '/public/account.html'); });
  url.get('/communication',       (req, res) => { res.sendFile(__dirname + '/public/communication.html'); });
  url.get('/post',                (req, res) => { res.sendFile(__dirname + '/public/post.html'); });
  
  url.post('/api/signup',         (req, res) => { endpoint.api_signup(req, res); });
  url.post('/api/login',          (req, res) => { endpoint.api_login(req, res); });
  url.post('/api/logout',         (req, res) => { endpoint.api_logout(req, res); });
  url.post('/api/checkAccount',   (req, res) => { endpoint.api_checkAccount(req, res); });
  url.post('/api/getAccountData', (req, res) => { endpoint.api_getAccountData(req, res); });
  url.post('/api/editAccount',    (req, res) => { endpoint.api_editAccount(req, res); });
  url.post('/api/newPost',        (req, res) => { endpoint.api_newPost(req, res); });
  url.post('/api/follow',         (req, res) => { endpoint.api_follow(req, res); })
  
  return url;
})();
