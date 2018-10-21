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

  url.get('/',                        (req, res, next) => { res.sendFile(__dirname + '/public/view.html'); });
  url.get('/account',                 (req, res, next) => { res.sendFile(__dirname + '/public/account.html'); });
  url.get('/communication',           (req, res, next) => { res.sendFile(__dirname + '/public/communication.html'); });
  url.get('/post',                    (req, res, next) => { res.sendFile(__dirname + '/public/post.html'); });
  
  url.post('/api/signup',             (req, res, next) => { endpoint.api_signup(req, res); });
  url.post('/api/login',              (req, res, next) => { endpoint.api_login(req, res); });
  url.post('/api/logout',             (req, res, next) => { endpoint.api_logout(req, res); });
  url.post('/api/checkAccount',       (req, res, next) => { endpoint.api_checkAccount(req, res); });
  url.post('/api/getAccountData',     (req, res, next) => { endpoint.api_getAccountData(req, res); });
  url.post('/api/editAccount',        (req, res, next) => { endpoint.api_editAccount(req, res); });
  url.post('/api/newPost',            (req, res, next) => { endpoint.api_newPost(req, res); });
  url.post('/api/deletePost',         (req, res, next) => { endpoint.api_deletePost(req, res); });
  url.post('/api/editPost',           (req, res, next) => { endpoint.api_editPost(req, res); })
  url.post('/api/getPost',            (req, res, next) => { endpoint.api_getPost(req, res); });
  url.post('/api/likePost',           (req, res, next) => { endpoint.api_likePost(req, res); });
  url.post('/api/follow',             (req, res, next) => { endpoint.api_follow(req, res); });
  url.post('/api/comment',            (req, res, next) => { endpoint.api_comment(req, res); });
  url.post('/api/message',            (req, res, next) => { endpoint.api_message(req, res); });
  url.post('/api/getMessages',        (req, res, next) => { endpoint.api_getMessages(req, res); });
  url.post('/api/getNotification', (req, res, next) => { endpoint.api_getNotification(req, res)})
  return url;
})();
