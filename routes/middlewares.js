// 로그인 되어있는지 체크
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
};

// 로그인 하기 전인지 체크
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
};

// 랜덤한 숫자 발생
exports.getRandomString = (length)=>{
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') // convert to hexa format
        .slice(0,length);
  };