// 로그인 되어있는지 체크
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.status(200).send('로그인이 필요합니다.');
    }
};

// 로그인 하기 전인지 체크
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      return res.status(200).send('이미 로그인 중입니다.');
    }
};

// 랜덤한 숫자 발생
exports.getRandomString = (length)=>{
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') // convert to hexa format
        .slice(0,length);
};

// 로컬 디스크 관련
// multer 설정 (디스크)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.basename(file.originalname))
  },
  limits: { //크기 제한
      fileSize: 50 * 1024 * 1024 // 테스트를 위해 5mb로 상향 조정
  },
});

// single image upload multer 객체
exports.upload = multer({ storage: storage });

exports.fileDelete = (filename) => {
  fs.exists(`uploads/${filename}`, function (exists) { //파일 있는지 확인
      console.log(exists ? "파일 있음" : "파일 없음");
      if (exists) { // 파일 있으면 삭제
          fs.unlink(`uploads/${filename}`, (err) => {
              if (err) {
                  return console.error(`파일 삭제 오류 \n ${err.stack}`);
              }
              return console.log(`파일 삭제 성공 \n ${filename}`);
          })
      }
  });
};