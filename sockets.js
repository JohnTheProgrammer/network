module.exports = (function(){
  var sockets = function(io){
    io.on('connection', function(socket){
      console.log('a user connected');
      
      socket.on('chat message', function(data){
        console.log('someone sent a message');
        io.emit('receive message', {to: data.to});
      });
      
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
      
    });
  }
  return sockets;
})();
