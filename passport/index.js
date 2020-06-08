const local = require('./logalStrategy');
const kakao = require('./kakaoStrategy');
// 모델
const { User } = require('../models');

module.exports = (passport) =>{
    console.log('passport index');

    passport.serializeUser((user, done) => {
        console.log('serializeUser 호출')
        done(null, user.user_uid);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            console.log('deserializeUser 호출');

            // 사용자 정보 불러옴
            const user = await User.findOne({
                where: { user_uid: id },
            });

            return done(null, user);
        } catch (e) {
            return done(e);
        }
    });

    local(passport);
    kakao(passport);

}