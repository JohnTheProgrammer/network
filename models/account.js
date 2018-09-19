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
    img: {data: Buffer, contentType: String },
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true}
  });

  accountSchema.pre('save', function (next) {
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
            return callback();
          }
        })
      });
  }

  account = mongoose.model('account', accountSchema);

}();