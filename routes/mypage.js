const express = require('express');
const router = express.Router();
const { User, Counselor, Paper } = require('../models');
const bcrypt = require('bcrypt');
const { upload, fileDelete, isLoggedIn, isNotLoggedIn } = require('./middlewares');
let result = {
    success: true,
    data: {
        user : null,
        counselor : null
    },
    message: ''
}
// 내 정보 보기
router.get('/', async(req, res, next)=>{
    // 유저 기본정보
    let user = {
        user_uid: req.user.user_uid,
        email: req.user.email,
        nickname: req.user.nickname,
        type: req.user.type
    }

    try {
        const paper = await Paper.findOne({
            where: { fk_user_uid: req.user.user_uid}
        });
        if(req.user.type==2){ // 전문 상담사인 경우
            const counselor = await Counselor.findOne({
                where: { user_uid: req.user.user_uid}
            });
            result.data.counselor = counselor;
        }
        result.success= true;
        result.data.user = user;
        
        result.message = '로그인 한 유저의 정보를 불러왔습니다.';
        console.log(result.data)
        
        return res.status(200).send(result); 
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 닉네임 변경
router.patch('/nickname', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const nickname = req.body.nickname;

    // 닉네임 검사 (필수값)
    if (!nickname) {
        result.success = false;
        result.data = '';
        result.message = "닉네임은 반드시 입력해야 합니다.";
        return res.status(200).json(result);
    }   
    try {
        // 닉네임 변경
        await User.update({
            nickname
        },{
            where: {user_uid}
        });
        // 변경된 유저정보 보여주기 위해 조회
        result.data.user = await User.findOne({
            
                where: {
                    user_uid: user_uid
                }
        });
        result.data.counselor = null;
        result.message = "닉네임 변경 완료";
        result.success = true;
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 비밀번호 변경
router.patch('/password', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const {pre_password, new_password, new_password_2} = req.body;
    try {
        // 1. 현재 비밀번호 맞는지 검사
        const comparePw = await bcrypt.compare(pre_password, req.user.password);
        if(!comparePw){
            result.success = false;
            result.data = null;
            result.message = "현재 비밀번호가 일치하지 않습니다.";
            return res.status(200).json(result);
        }
        // 2. 새로운 비밀번호 == 비밀번호 확인 맞는지 검사
        if(new_password!=''&& new_password_2!='' && new_password!=new_password_2){
            result.success = false;
            result.data = null;
            result.message = "새로운 비밀번호 입력을 다시 확인하십시오.";
            return res.status(200).json(result);
        }
        // 비밀번호 변경
        const encryptPassword = await bcrypt.hash(new_password_2, 12);
        await User.update({
            password: encryptPassword
        }, {
            where: {user_uid}
        });
        result.data = null;
        result.message = "비밀번호 변경 완료";
        result.success = true;
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 프로필 변경 (사진, 한 줄 소개)
router.patch('/counselor/profile', upload.single('file'), async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const { name_formal, description} = req.body;
    // 유저 기본정보
    let user = {
        user_uid: req.user.user_uid,
        email: req.user.email,
        nickname: req.user.nickname,
        type: req.user.type
    }
    result.data.user = user;

    try {
        // 상담사 정보 검색: 이미 사진 있는지 보기
        const counselor = await Counselor.findOne({
                where:  {user_uid: req.user.user_uid }
        });
        // 실명은 최초 1회만 변경
        if(counselor.name_formal==null) {
            counselor.name_formal = name_formal;
        }
        // 한 줄 소개
        counselor.description = description;
        // 프로필 사진 수정
        if(req.file){ // 클라이언트가 보낸 새 파일 있을 때
            console.log(`프로필 사진 수정`);
            // 기존 사진 삭제
            fileDelete(counselor.picture);
            counselor.picture = req.file.filename;
        }else{ // 클라이언트가 보낸 파일 없으면 기존 그대로 사용 (사진 삭제는 없음)
            console.log(`프로필 사진 그대로 사용`);
        }

        // 변경사항 저장
        await counselor.save();
        
        result.data.counselor = counselor;
        result.message = "상담사 프로필 변경 완료";
        result.success = true;
        return res.status(200).json(result);        
    } catch (error) {
        console.log(error);
        return next(error);        
    }
});

// 상담사 소개 변경
router.patch('/counselor/intro', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const {intro_1, intro_2, intro_3} = req.body;
    // 유저 기본정보
    let user = {
        user_uid: req.user.user_uid,
        email: req.user.email,
        nickname: req.user.nickname,
        type: req.user.type
    }
    result.data.user = user;

    try {
        // 상담사 업데이트
        await Counselor.update({
            intro_1,
            intro_2,
            intro_3
        }, {
            where: {user_uid}
        });
        // 변경된 유저정보 보여주기 위해 조회
        result.data.counselor = await Counselor.findOne({
            
            where: {
                user_uid: user_uid
            }
        });
        result.message = "상담사 소개 변경 완료";
        result.success = true;
        return res.status(200).json(result);
        
    } catch (error) {
        console.log(error);
        return next(error);        
    }
});

// 상담사 약력 변경
router.patch('/counselor/experience', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const {certificate, career, education} = req.body;
    // 유저 기본정보
    let user = {
        user_uid: req.user.user_uid,
        email: req.user.email,
        nickname: req.user.nickname,
        type: req.user.type
    }
    result.data.user = user;
    try {
        // 상담사 업데이트
        await Counselor.update({
            certificate,
            career,
            education
        }, {
            where: {user_uid}
        });
        // 변경된 유저정보 보여주기 위해 조회
        result.data.counselor = await Counselor.findOne({
            
                where: {
                    user_uid: user_uid
                }
        });
        result.message = "상담사 약력 변경 완료";
        result.success = true;
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return next(error);        
    }
});

// 상담사 선호일정 변경
router.patch('/counselor/time_prefered', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const {day, time} = req.body;
    let time_prefered = {
        day: day,
        time: time
    } // -> json stringfy
    const stringify = JSON.stringify(time_prefered);
    // 유저 기본정보
    let user = {
        user_uid: req.user.user_uid,
        email: req.user.email,
        nickname: req.user.nickname,
        type: req.user.type
    }
    result.data.user = user;
    try {
        // 상담사 업데이트
        await Counselor.update({
            time_prefered: stringify
        }, {
            where: {user_uid}
        });
        // 변경된 유저정보 보여주기 위해 조회
        result.data.counselor = await Counselor.findOne({
            
                where: {
                    user_uid: user_uid
                }
        });
        result.message = "상담사 선호일정 변경 완료";
        result.success = true;
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return next(error);        
    }
});

// 상담사 회기당 가격설정 변경
router.patch('/counselor/price', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const {price, discount_4w, discount_10w} = req.body;
    // 유저 기본정보
    let user = {
        user_uid: req.user.user_uid,
        email: req.user.email,
        nickname: req.user.nickname,
        type: req.user.type
    }
    result.data.user = user;
    try {
        // 상담사 업데이트
        await Counselor.update({
            price,
            discount_4w,
            discount_10w
        }, {
            where: {user_uid}
        });
        // 변경된 유저정보 보여주기 위해 조회
        result.data.counselor = await Counselor.findOne({
            
                where: {
                    user_uid: user_uid
                }
        });
        result.message = "상담사 가격설정 변경 완료";
        result.success = true;
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return next(error);        
    }
});

// 상담사 입금계좌 변경
router.patch('/counselor/bank_account', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const {bank_name, account_number} = req.body;
    // 유저 기본정보
    let user = {
        user_uid: req.user.user_uid,
        email: req.user.email,
        nickname: req.user.nickname,
        type: req.user.type
    }
    result.data.user = user;
    let bank_account = {
        bank_name,
        account_number
    }
    const stringify = JSON.stringify(bank_account);
    try {
        // 상담사 업데이트
        await Counselor.update({
            bank_account: stringify
        }, {
            where: {user_uid}
        });
        // 변경된 유저정보 보여주기 위해 조회
        result.data.counselor = await Counselor.findOne({
            
                where: {
                    user_uid: user_uid
                }
        });
        result.message = "상담사 입금계좌 변경 완료";
        result.success = true;
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return next(error);        
    }
});


module.exports = router;