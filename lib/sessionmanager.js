

function SessionManager(options, serializeUser) {
  //如果传递了一个参数，则把参数赋值给序列化用户信息的回调。
  if (typeof options == 'function') {
    serializeUser = options;
    options = undefined;
  }
  options = options || {};

  this._key = options.key || 'passport';
  this._serializeUser = serializeUser;
}

SessionManager.prototype.logIn = function(req, user, cb) {
  var self = this;
  //序列化用户信息。
  this._serializeUser(user, req, function(err, obj) {
    if (err) {
      return cb(err);
    }
    if (!req._passport.session) {
      req._passport.session = {};
    }
    req._passport.session.user = obj;
    if (!req.session) {
      req.session = {};
    }
    //将缓存信息保存在session对象上。
    req.session[self._key] = req._passport.session;
    cb();
  });
}

SessionManager.prototype.logOut = function(req, cb) {
  if (req._passport && req._passport.session) {
    //删除掉当前用户的session信息。
    delete req._passport.session.user;
  }
  cb && cb();
}


module.exports = SessionManager;
