const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = (passport) =>{
    console.log('kakaoStrategy start');

    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log('KakaoStrategy_async');
        console.log(profile);
        try {
            const exUser = await User.findOne({
                where: {
                    snsId: profile.id,
                    provider: 'kakao',
                },
            });
            if(exUser){
                return done(null, exUser);
            } else {
                // 추후 type 변수값 받을 방법 고려
                const user_uid = await bcrypt.hash(email, 12);
                const newUser = await User.Create({
                    user_uid,
                    email:email,
                    nickname: profile.nickname,
                    password: '',
                    snsId: profile.id,
                    provider: 'kakao'
                });
                // 개인별 상담접수지 생성
                await Paper.create();

                // if(type==2){ // 전문 상담가 가입
                //     await Counselor.create({user_uid});  
                // }
                
                return done(null, newUser);
            }            
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }));
};