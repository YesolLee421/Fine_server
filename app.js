const express = require('express')
const app = express()
const { sequelize } = require('./models');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const http = require('http');

// passport
const passport = require('passport');
const passportConfig = require('./passport');
passportConfig(passport);

// socket.io 추가
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./routes/middlewares');

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
const caseRouter = require('./routes/cases');
const paperRouter = require('./routes/paper');
const chatRouter = require('./routes/chat');
// bodyParser 사용설정

// Routers
app.use('/auth', authRouter);
app.use('/counselors', counselorRouter);
app.use('/mypage', myPageRouter);
app.use('/cases', caseRouter);
app.use('/paper', paperRouter);
app.use('/chat', chatRouter);

// http 에러 
// 404
app.use((err, req, res, next)=>{
    console.log(`Clinet ERROR:${err}`);
    let result = {
        success: false,
        data: '',
        message: `Clinet ERROR:${err}`
    }
    return res.status(400).send(result);
});
// 서버에러 500번대
app.use((err, req, res, next)=>{
    console.log(`Server ERROR:${err}`);
    let result = {
        success: false,
        data: '',
        message: `Server ERROR: ${err}`
    }
    return res.status(500).send(`Server ERROR`);
});

// socket 채팅
const botName = 'Fine Bot';

// 클라이언트 접속 시
io.on('connection', socket => {
    // 방 접속
    socket.on('joinRoom', ({user_uid, username, room, type }) => {
        user_uid, username, room, type
      const user = userJoin(socket.id, user_uid, username, room, type);
  
      socket.join(user.room);
  
      // 방 접속 시 환영 메시지
      socket.emit('notice', formatMessage(botName, '채팅 상담이 시작되었습니다. 상담을 위해 모든 대화는 안전하게 저장됩니다.'));
  
      // 방 접속 시 기존 유저에게 새 유저 접속 알림
      socket.broadcast
        .to(user.room)
        .emit(
          'notice',
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // 메세지 처리
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit('message',formatMessage(user.username, msg));
      // db에 저장
      try {
        Message.create({
          sender_uid: user.user_uid,
          content: msg,
          fk_case_id: user.room
        });
        
      } catch (error) {
        console.error(error);
      }
    });

    // 입력 중
    socket.on('on typing', function(typing){
        console.log("Typing.... ");
        io.emit('on typing', typing);
    });
  
    // 클라이언트 접속 종료
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });


server.listen(app.get('port'), () => console.log(`Example app listening at http://localhost:${app.get('port')}`))

module.exports = app, io;