const express = require('express');
const router = express.Router();
// 모델
const { Case, Counselor, User, Paper, Message } = require("../models");
// 미들웨어
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
// response 형식
let result = {
    success: false,
    data: null,
    message: ''
}
// 개인 상담접수지 조회
// 상담 접수지 조회
router.get('/', isLoggedIn, async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    try {
        // couselor name_formal 정보도 받아오기
        const paper = await Paper.findOne({
            where:{ fk_user_uid: user_uid }
        });
        result.success = true;
        result.message = '상담 접수지 조회 완료'
        result.data = paper;
        return res.status(200).json(result);        
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

// 상담접수지 전체 저장 (user-hasPaper도 바꿔주기)
router.put('/', isLoggedIn, async(req, res, next)=>{
    try {
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

module.exports = router;