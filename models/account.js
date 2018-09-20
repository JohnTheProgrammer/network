module.exports = function(){
  var mongoose = require('mongoose');
  var bcrypt = require('bcrypt');
  var Schema = mongoose.Schema;

  mongoose.Promise = global.Promise;

  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  var accountSchema = new Schema({
    fname: {type: String, required: true, trim: true},
    lname: {type: String, required: true, trim: true},
    username: {type: String, required: true, unique: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    date: { type: Date, default: Date.now },
    accountType: String,  
    posts: [{body:String, comments:[{owner:String, comment: String, date:Date}], likes:[{liker: String}], date: { type: Date, default: Date.now }}],
    following: [{body: String}],
    followers: [{body: String}],
    notifications: [{owner: String, date: Date, post:Number}]
  });

  accountSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    
    var account = this;
    bcrypt.hash(account.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      account.password = hash;
      next();
    })
  });

  accountSchema.statics.authenticate = function (username, password, callback) {
    account.findOne({ username: username })
      .exec(function (err, account) {
        if (err) {
          return callback(err)
        } else if (!account) {
          var err = new Error('Account not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, account.password, function (err, result) {
          if (result === true) {
            return callback(null, account);
          } else {
            err = new Error('Password is wrong');
            err.status = 401
            return callback(err);
          }
        })
      });
  }

  account = mongoose.model('account', accountSchema);

}();
