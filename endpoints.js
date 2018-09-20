module.exports = (function(){
  var mongoose = require('mongoose');
  var account = mongoose.model('account');

  var endpoints = {
    api_signup: function(req, res){
      account.create({fname: req.body.fname, lname: req.body.lname, username: req.body.username, email: req.body.email, password: req.body.password, accountType: 'user'}, (err, instance) => {
        if (err){
          res.send(err);
          return err;
        } else {
          req.session.accountid = req.body.username;
          res.send('/account#!/' + req.session.accountid);
          return console.log('account create success');
        }
      });
    },
    
    api_login: function(req, res){
      account.authenticate(req.body.username, req.body.password, function(error, account){
        if (error || !account) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          res.send(err);
          return err
        } else {
          req.session.accountid = account.username;
          return res.send('/account#!/' + req.session.accountid);
        }
      });
    },
    
    api_logout: function(req, res){
      req.session.accountid = '';
      res.send('logout successful');
    },
    
    api_checkAccount: function(req, res){      
      res.send(req.session.accountid);
    },
    
    api_getAccountData: function(req, res){
      account.findOne({ 'username':  req.body.accountid}, function(err, account){
        if(err || !account){
          var err = new Error('Wrong email or password.');
          err.status = 401;
          res.send(err);
          return err;
        }else{
          res.json({'username': account.username, 'fname': account.fname, 'lname': account.lname, 'post': account.post, 'following': account.following, 'followers': account.followers, 'posts': account.posts});
        }        
      });     
    },
    
    api_editAccount: function(req, res){
      account.findOneAndUpdate({'username': req.session.accountid}, {'username': req.body.username, 'fname': req.body.fname, 'lname': req.body.lname, 'email': req.body.email}, function(err, account){
        if(err || !account){
          res.send(err);
        }else{
          req.session.accountid = req.body.username;
          return res.send('/account#!/' + req.session.accountid);
        }
      });
    },
    
    api_newPost: function(req, res){
      var query = account.findOne({ 'username':  req.session.accountid}, function(err, account){      
        if (err || !account){
          res.send(err);
        }else{
          account.posts.push({body: req.body.body});
          account.save(function(err){});
          return res.send('/account#!/' + req.session.accountid);
        }
      });
    }
  }
  return endpoints;
})();
