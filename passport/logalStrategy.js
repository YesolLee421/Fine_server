const LocalStrategy = require('passport-local').Strategy;
// 모델
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    console.log('localStrategy start');
    
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: true
    } ,  async (email, password, done)=> { // done(authError, user, info)
        console.log('localStrategy_async');
            try {
                const exUser = await User.findOne({where: {email}});              

                if(exUser){ // 유저있음
                    // 비밀번호 비교
                    const result = await bcrypt.compare(password, exUser.password);
                    if(result){ // 비밀번호 일치 = 로그인성공
                        return done(null, exUser);
                    }else{ // 비밀번호 불일치
                        return done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                    }
                }else{ // 유저 없음
                    return done(null, false, {message: '가입되지 않은 회원입니다.'});
                }
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }));
};