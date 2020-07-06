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
const problem = [ "일반", "연애", "대인관계", "정신건강"," 자아/성격", "가족", 
"취업/진로", "학업/고시", "성추행", "직장", "외모", "결혼/육아", "금전/사업", "신체건강", 
"이별/이혼", "중독/집착", "LGBT" ];
const symptom = ["스트레스", "조울증", "우울", "불안", "화병", "공황", "강박", "트라우마", "자존감",
     "콤플렉스", "신체화", "불면", "섭식", "충동/폭력", "자살", "조현병"];

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
router.put('/', isLoggedIn, async(req, res, next)=>{

    const user_uid = req.user.user_uid;
    const {
        gender, birth_year, job, counselBefore, clinicBefore, 
        problem, symptom, religion, education, livingCondition, 
        isMarried, hasMate, family, request
    } = req.body;
    
    let isCompleted = true;
    const str_problem = JSON.stringify(problem);
    const str_symptom = JSON.stringify(symptom);

    if(gender!==-1 || !birth_year || job!==-1 || counselBefore!==-1 || clinicBefore!==-1 || 
        religion!==-1 || education!==-1 || livingCondition!==-1 || isMarried!==-1 || 
        hasMate!==-1 || !family || !request || !str_problem || !str_symptom) {
            isCompleted = false;
        }

    // const values = {gender, birth_year, job, counselBefore, clinicBefore, 
    //      religion, education, livingCondition, isMarried, hasMate, family, request};

    try {
        // paper 변경
        await Paper.update({
            gender, 
            birth_year, 
            job, 
            counselBefore, 
            clinicBefore, 
            problem: str_problem, 
            symptom: str_symptom, 
            religion, 
            education, 
            livingCondition, 
            isMarried, 
            hasMate, 
            family, 
            request, 
            isCompleted
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