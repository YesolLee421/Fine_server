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

// 상담 - 접수지 번호로 조회 (상담사가 조회할 경우)
router.get('/:paper_id', isLoggedIn, async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const paper_id = req.params.paper_id;
    try {
        // couselor name_formal 정보도 받아오기
        const paper = await Paper.findOne({
            where:{ id: paper_id }
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
router.put('/:', isLoggedIn, async(req, res, next)=>{

    const user_uid = req.user.user_uid;
    const {
        gender, birth_year, job, counselBefore, clinicBefore, 
        problem, symptom, religion, education, livingCondition, 
        isMarried, hasMate, family, request
    } = req.body;
    try {
        // paper 변경
        await Paper.update({
            gender, 
            birth_year, 
            job, 
            counselBefore, 
            clinicBefore, 
            problem, 
            symptom, 
            religion, 
            education, 
            livingCondition, 
            isMarried, 
            hasMate, 
            family, 
            request
        }, {
            where: { fk_user_uid: user_uid }
        });
        // 변경된 정보 조회
        result.data = await Paper.findOne({
            where: {fk_user_uid: user_uid}
        });
        result.message = "상담접수지 전체수정 완료";
        result.success = true;
        return res.status(200).json(result);
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

// 상담접수지 1페이지 저장 (user-hasPaper도 바꿔주기)
router.patch('/info_1', isLoggedIn, async(req, res, next)=>{
    try {
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

// 상담접수지 2페이지 저장 (user-hasPaper도 바꿔주기)
router.patch('/info_2', isLoggedIn, async(req, res, next)=>{
    try {
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

// 상담접수지 3페이지 저장 (user-hasPaper도 바꿔주기)
router.patch('/info_3', isLoggedIn, async(req, res, next)=>{
    try {
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

module.exports = router;