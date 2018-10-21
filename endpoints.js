module.exports = (function(){
  var mongoose = require('mongoose');
  var Account = mongoose.model('account');

  var endpoints = {
    api_signup: function(req, res){
      Account.create({fname: req.body.fname, lname: req.body.lname, username: req.body.username, email: req.body.email, password: req.body.password, accountType: 'user', bio: req.body.bio, seenNotifs: true, pfp: 'http://mainenordmenn.com/wp-content/uploads/2017/09/Maine-Nordmenn-Board-Generic-Profile.jpg'}, (err, instance) => {
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
      Account.authenticate(req.body.username, req.body.password, function(error, account){
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
      Account.findOne({ 'username':  req.session.accountid}, function(err, account){
        if(err || !account){
          var err = new Error('Wrong email or password.');
          err.status = 401;
          res.send(err);
          return err;
        }else{
          res.json({'username': account.username, 'fname': account.fname, 'lname': account.lname, 'post': account.post, 'following': account.following, 'followers': account.followers, 'email': account.email, 'bio': account.bio, 'pfp': account.pfp, 'seenNotifs': account.seenNotifs});
        }        
      });
    },
    
    api_getAccountData: function(req, res){
      Account.findOne({ 'username':  req.body.accountid}, function(err, account){
        if(err || !account){
          var err = new Error('Wrong email or password.');
          err.status = 401;
          res.send(err);
          return err;
        }else{
          res.json({'username': account.username, 'fname': account.fname, 'lname': account.lname, 'following': account.following, 'followers': account.followers, 'posts': account.posts, 'bio': account.bio, 'pfp': account.pfp});
        }        
      });     
    },
    
    api_editAccount: function(req, res){
      Account.findOneAndUpdate({'username': req.session.accountid}, {'username': req.body.username, 'fname': req.body.fname, 'lname': req.body.lname, 'email': req.body.email, 'bio': req.body.bio, 'pfp': req.body.pfp}, function(err, account){
        if(err || !account){
          res.send(err);
        }else{
          account.posts.forEach(function(post){
            post.owner = req.body.username;
          });
          account.save(function(err){});
          req.session.accountid = req.body.username;
          return res.send('/account#!/' + req.session.accountid);
        }
      });
    },
    
    api_newPost: function(req, res){
      Account.findOne({ 'username':  req.session.accountid}, function(err, account){      
        if (err || !account){
          res.send(err);
        }else{
          var post = account.posts.create({body: req.body.body, owner:req.session.accountid, postType: req.body.type, image: req.body.image});
          account.posts.push(post);
          var tags = post.body.match(/@[-a-zA-Z0-9_]+/gi);
          var taggerPfp = account.pfp;
          console.log(tags);
          if(tags != null){
            tags.forEach(function(taggedAccount){
              console.log(taggedAccount);
              Account.findOne({'username': taggedAccount.replace('@', '')}, function(err, account){
                if(err || !account){
                  console.log('error or account not found');
                }else{
                  account.seenNotifs = false;
                  account.notifications.push({owner: post.owner, date: post.date, post: post._id, ownerpfp: taggerPfp, postOwner: post.owner, body: post.body});
                  account.save(function(err){});
                }  
              });
            });
          }
          
          account.save(function(err){});
          return res.send('/account#!/' + req.session.accountid);
        }
      });
    },
    
    api_editPost: function(req, res){
      Account.findOne({ 'username': req.body.owner}, function(err, account){
        if( err|| !account){
          res.send(err);
        }else{
          var post = account.posts.id(req.body._id);
          post.postType = req.body.type;
          post.body = req.body.body;
          post.image = req.body.image;
          account.save(function(err){
            if(err){ 
              console.log(err);
            }else{
              console.log('success');
            }
          });
          res.send('successful');
        }
      });
    },
    
    api_getPost: function(req, res){
      Account.findOne({ 'username': req.body.account}, function(err, account){
        if( err|| !account){
          res.send(err);
        }else{
          return res.send(account.posts.id(req.body.id));
        }
      });
    },
    
    api_likePost: function(req, res){
      console.log('hit endpoint');
      Account.findOne({ 'username': req.body.account}, function(err, account){
        if(err || !account){
          console.log('error');
        }else{
          var found = false;
          var post = account.posts.id(req.body.id);
          for(var i = 0; i < post.likes.length; i++){
            if(req.session.accountid == post.likes[i].liker){
              post.likes.splice(i, 1);
              found = true;
            }
          }
          if(found == false){
            post.likes.push({ liker : req.session.accountid });
          }
          account.save(function(err){
            if(err){ 
              console.log(err);
            }else{
              console.log('success');
            }
          });
          res.send('success');
        }
      });
    },
    
    api_deletePost: function(req, res){
      Account.findOne({ 'username': req.body.account}, function(err, account){
        if(err || !account){
          console.log('did not find account');
          res.send(err);
        }else{
          console.log('found account');
          account.posts.id(req.body.id).remove();
          account.save(function(err){
            if(err){ 
              console.log(err);
            }else{
              console.log('success');
            }
          });
          res.send('/account#!/' + req.body.account);
        }
      });
    },
    
    api_follow: function(req, res){
      var accountError = false;
      Account.findOne({'username': req.session.accountid}, function(err, account){
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
        Account.findOne({'username': req.body.following}, function(err, account){
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
    },
    
    api_comment: function(req, res){
      console.log(req.session.accountid);
      if(req.session.accountid != undefined && req.session.accountid != ''){
        Account.findOne({'username': req.body.postOwner}, function(err, account){
          if( err || !account){
            console.log('error or account not found');
          }else{            
            var post = account.posts.id(req.body.id);
            var comment = post.comments.create({owner: req.session.accountid, comment: req.body.comment, date: Date.now()});
            post.comments.push(comment);
            
            var tags = post.body.match(/@[-a-zA-Z0-9_]+/gi);
            var taggerPfp = account.pfp;
            console.log(tags);
            if(tags != null){
              tags.forEach(function(taggedAccount){
                console.log(taggedAccount);
                Account.findOne({'username': taggedAccount.replace('@', '')}, function(err, account){
                  if(err || !account){
                    console.log('error or account not found');
                  }else{
                    accountTagger = Account.findOne({'username': req.session.accountid});
                    account.seenNotifs = false;
                    account.notifications.push({owner: req.session.accountid, date: comment.date, post: post._id, ownerpfp: accountTagger.pfp, postOwner: post.owner, body: comment.comment});
                    account.save(function(err){});
                  }  
                });
              });
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
      return res.send('test');
    },
    
    api_message: function(req, res){
      Account.findOne({'username': req.session.accountid}, function(err, account){
        if(err || !account){
          console.log('error or account not found');
        }else{
          account.messages.push({to: req.body.to, date: Date.now(), message: req.body.message});
          account.save(function(err){
            if(err){
              console.log(err);
            }else{
              console.log('success');
            }
          });
          res.send('success');
        }
      });
    },
    
    api_getMessages: async function(req, res){
      var messReceived = [];
      var messSent = [];
      await Account.findOne({'username': req.body.messaging}, function(err, account){
        if(err || !account){
          console.log('error or account not found');
        }else{
          account.messages.forEach(function(message){
            if(req.session.accountid == message.to){
              messReceived.push(message);
            }
          });
        }
      });
      
      await Account.findOne({'username': req.session.accountid}, function(err, account){
        if(err || !account){
          console.log('error or account not found');
        }else{
          account.messages.forEach(function(message){
            if(req.body.messaging == message.to){
              messSent.push(message);
            }
          });
          
          var messages = messReceived.concat(messSent);
          messages.sort(function(a, b){
            return new Date(a.date) - new Date(b.date);
          });
          
          res.send(messages);
        }
      });

    },
    
    api_getNotification: function(req, res){
      Account.findOne({'username': req.session.accountid}, function(err, account){
        if(err || !account){
          console.log('error or account not found');
        }else{
          account.seenNotifs = true;
          account.save(function(err){});
          var notifications = account.notifications.sort(function(a, b){
            return new Date(b.date) - new Date(a.date);
          });
          res.send(notifications);
        }  
      });
    }
  }
  return endpoints;
})();
