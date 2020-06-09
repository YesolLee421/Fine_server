// express
const express = require('express');
const router = express.Router();

// 모델
const { User, Counselor, Paper } = require('../models');

// passport 인증
const passport = require('passport');
const bcrypt = require('bcrypt');

// 미들웨어
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 테스트용 get user list
router.get('/', async (req, res, next)=>{
    try{
        const users = await User.findAll();
        console.log("All users:", JSON.stringify(users, null, 2));
        let result = {
            success: true,
            data: '',
            message: '모든 유저 조회 성공'
        }
        if(users[0]==null){
            result.message = '유저가 하나도 없습니다.'
        }
        result.data = users;
        return res.status(200).json(result);

    }catch (err) {
        console.error(err);
        return next(err);
    }
});



// register
router.post('/register', async (req, res, next)=>{
    const { email, nickname, password, type} = req.body;
    if(!email && !nickname && !password && !type) {
        let result = {
            success: false,
            data: '',
            message: '이메일, 비밀번호, 닉네임, 사용자 유형을 반드시 입력하십시오.'
        }
        return res.status(200).send(result);    
    }
    try {
        const exUser = await User.findOne({where:{email}});
        if(exUser){
            let result = {
                success: false,
                data: '',
                message: '이미 가입된 이메일입니다.'
            }
            return res.status(200).send(result);       
        }else{
            // user_uid, 비밀번호 암호화

            const user_uid = await bcrypt.hash(email, 12);
            const encryptPassword = await bcrypt.hash(password, 12);
            
            await User.create({
                user_uid,
                email,
                nickname,
                password: encryptPassword,
                type
            });
            // 개인별 상담접수지 생성
            await Paper.create();

            // 회원가입 유저정보 반환
            let registeredUser = {
                nickname: nickname,
                email: email,
                type:''
            }

            if(type==2){ // 전문 상담가 가입
                await Counselor.create({
                    user_uid
                });
                registeredUser.type = '전문상담사';
            } else if( type==1){
                registeredUser.type = '관리자';
            }else{
                registeredUser.type = '일반사용자';
            }

            let result = {
                success: true,
                data: registeredUser,
                message: '가입 성공'
            }
            return res.status(200).send(result);     
        }
    } catch (error) {
        console.error(error);
        next(error);
    }

});

// local login
router.post('/login', (req, res, next)=>{
    console.log('login 라우터 시작');
    const { email, password} = req.body;
    console.log(`email=${email}, password=${password}`);
    if(!email && !password) {
        let result = {
            success: false,
            data: '',
            message: '이메일, 비밀번호를 반드시 입력하십시오.'
        }
        return res.status(200).send(result);    
    }

    passport.authenticate('local', (authError, user, info)=>{
        console.log('login 라우터 passport.authenticate 시작');
        //1. 에러 발생
        if(authError){
            console.error(authError);
            let result = {
                success: false,
                data: '',
                message: info.message
            }
            return next(authError);
        }
        // 2. 실패 (유저 없음)
        if(!user){
            let result = {
                success: false,
                data: '',
                message: info.message
            }
            return res.status(200).send(result);
        } else { // 3. 성공
            return req.login(user, (loginError)=>{
                // 로그인 에러
                if(loginError){
                    console.error(loginError);
                    return next(loginError);
                }
                // 로그인한 유저 정보 반환
                let loggedInUser = {
                    nickname: user.nickname,
                    email: user.email,
                    type: user.type
                }
                let result = {
                    success: true,
                    data: loggedInUser,
                    message: '로그인에 성공하였습니다.'
                }
                return res.status(200).send(result); 
            });

        }
    })(req, res, next); // 미들웨어 내의 미들웨어에 추가
});

// kakao login
// kakao로 인증요청
router.get('/kakao', passport.authenticate('kakao'));

// 응답내용 처리
router.post('/kakao/callback', passport.authenticate('kakao'), (req , res)=>{
    let result = {
        success: true,
        data: '',
        message: '카카오 로그인에 성공하였습니다.'
    }
    return res.status(200).send(result); 
});


// logout
router.get('/logout', isLoggedIn, (req, res, next)=>{
    req.logout();
    let result = {
        success: true,
        data: '',
        message: '로그아웃 성공'
    }
    return res.status(200).send(result); 
});




module.exports = router;