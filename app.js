const express = require('express')
const app = express()
const { sequelize } = require('./models');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const passport = require('passport');
const passportConfig = require('./passport');
passportConfig(passport);


// 세션 활성화 + 설정
app.use(morgan('dev'));
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    },
}));

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// db구조 생성
sequelize.sync();

app.set('port', process.env.PORT || 5000); //포트 설정
app.get('/', (req, res) => res.send('Hello World! hh'));

// 라우터 선언
const authRouter = require('./routes/auth');
const counselorRouter = require('./routes/counselors');
const myPageRouter = require('./routes/mypage');
// bodyParser 사용설정

// Routers
app.use('/auth', authRouter);
app.use('/counselors', counselorRouter);
app.use('/mypage', myPageRouter);

// http 에러 
// 404
app.use((err, req, res, next)=>{
    console.log(`Clinet ERROR:${err}`);
    res.status(400).send(`404 Not Found: ${err}`);
});
// 서버에러 500번대
app.use((err, req, res, next)=>{
    console.log(`Server ERROR:${err}`);
    res.status(500).send(`Server ERROR`);
});










app.listen(app.get('port'), () => console.log(`Example app listening at http://localhost:${app.get('port')}`))

module.exports = app;