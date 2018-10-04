module.exports = (function(){
  var mongoose = require('mongoose');
  var account = mongoose.model('account');

  var endpoints = {
    api_signup: function(req, res){
      account.create({fname: req.body.fname, lname: req.body.lname, username: req.body.username, email: req.body.email, password: req.body.password, accountType: 'user', bio: req.body.bio}, (err, instance) => {
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
      account.findOne({ 'username':  req.session.accountid}, function(err, account){
        if(err || !account){
          var err = new Error('Wrong email or password.');
          err.status = 401;
          res.send(err);
          return err;
        }else{
          res.json({'username': account.username, 'fname': account.fname, 'lname': account.lname, 'post': account.post, 'following': account.following, 'followers': account.followers});
        }        
      });
    },
    
    api_getAccountData: function(req, res){
      account.findOne({ 'username':  req.body.accountid}, function(err, account){
        if(err || !account){
          var err = new Error('Wrong email or password.');
          err.status = 401;
          res.send(err);
          return err;
        }else{
          res.json({'username': account.username, 'fname': account.fname, 'lname': account.lname, 'following': account.following, 'followers': account.followers, 'posts': account.posts, 'bio': account.bio});
        }        
      });     
    },
    
    api_editAccount: function(req, res){
      account.findOneAndUpdate({'username': req.session.accountid}, {'username': req.body.username, 'fname': req.body.fname, 'lname': req.body.lname, 'email': req.body.email, 'bio': req.body.bio}, function(err, account){
        if(err || !account){
          res.send(err);
        }else{
          req.session.accountid = req.body.username;
          return res.send('/account#!/' + req.session.accountid);
        }
      });
    },
    
    api_newPost: function(req, res){
      account.findOne({ 'username':  req.session.accountid}, function(err, account){      
        if (err || !account){
          res.send(err);
        }else{
          account.posts.push({body: req.body.body, owner:req.session.accountid});
          account.save(function(err){});
          return res.send('/account#!/' + req.session.accountid);
        }
      });
    },
    
    api_follow: function(req, res){
      var accountError = false;
      account.findOne({'username': req.session.accountid}, function(err, account){
        if(err || !account){
          console.log('account not found or error encountered');
          accountError = true;
        }else{
          var found = false;
          for(var i = 0; i < account.following.length; i++){
            if(req.body.following == account.following[i].username){
              account.following.splice(i, 1);
              found = true;
            }
          }
          if(found == false){
            account.following.push({ username : req.body.following });
          }
          account.save(function(err){
            if(err){ 
              console.log(err);
            }else{
              console.log('success');
            }
          });
        }
      });
      if(accountError == false){
        account.findOne({'username': req.body.following}, function(err, account){
          if(err || !account){
            console.log('account not found or error encountered')
          }else{
            console.log(req.session.accountid);
            console.log(account.followers);
            var found = false;
            for(var i = 0; i < account.followers.length; i++){
              if(req.session.accountid == account.followers[i].username){
                account.followers.splice(i, 1);
                found = true;
              }
            }
            if(found == false){
              console.log(req.session.accountid);
              account.followers.push({ username : req.session.accountid });
              console.log(account.followers);
            }
            account.save(function(err){
              if(err){ 
                console.log(err);
              }else{
                console.log('success');
              }
            });
          }
        });
      }
      
      return res.send('success');
    }
  }
  return endpoints;
})();
