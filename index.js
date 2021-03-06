require('./models/account.js');
var mongoose = require('mongoose');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('./urls.js');
var sockets = require('./sockets.js')(io);


mongoose.connect('mongodb://127.0.0.1:27017/rpnetwork', { useNewUrlParser: true });

app.use(url);
http.listen(3000, function(){
  console.log('listening on *:3000');
});
