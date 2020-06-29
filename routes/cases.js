// express
const express = require("express");
const router = express.Router();
// 모델
const { Case, Counselor, User, Paper } = require("../models");
const Sequelize = require('sequelize');
// 미들웨어
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

// response 형식
let result = {
    success: false,
    data: null,
    message: ''
}


// 전체 상담 목록 보기
router.get('/', isLoggedIn, async (req, res, next)=>{
    // 유저인 경우 / 상담사인 경우 검색 다름
    const type = req.user.type;

    try {
        let query;
        if(type==3) { // 일반인
            query = 
            'SELECT cases.*, counselors.name_formal AS counselor_name, counselors.picture AS counselor_picture ' +
            'From cases ' + 
            'LEFT JOIN counselors ON counselors.user_uid=cases.counselor_id ' + 
            'WHERE cases.fk_user_uid=:user_uid ' + 
            'ORDER BY cases.status ASC';
        } else if(type==2) { // 상담사
            query = 
            'SELECT cases.*, counselors.name_formal AS counselor_name, counselors.picture AS counselor_picture ' +
            'From cases ' + 
            'LEFT JOIN counselors ON counselors.user_uid=cases.counselor_id ' + 
            'WHERE cases.counselor_id=:user_uid ' + 
            'ORDER BY cases.status ASC';
        } else { // 관리자
            query = 
            'SELECT cases.*, counselors.name_formal AS counselor_name, counselors.picture AS counselor_picture ' +
            'From cases ' + 
            'LEFT JOIN counselors ON counselors.user_uid=cases.counselor_id ';
        }
    
        await sequelize.query(query, {
            replacements: { user_uid: req.user.user_uid },
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        }).then(cases =>{
            result.message = '전체 상담 조회 완료'
            if(cases[0]==null){
                result.message = '상담 내역이 하나도 없습니다.'               
            }
            result.success = true;
            result.data = cases;

        });

        return res.status(200).json(result);   
        
    } catch (error) {
        console.error(error);
        next(error);       
    }

});

// 개별 상담 케이스 보기
router.get('/:case_id', async(req, res, next)=>{
    const case_id = parseInt(req.params.case_id);

    try {
        let query = 
        'SELECT cases.*, counselors.name_formal AS counselor_name, counselors.picture AS counselor_picture ' +
        'From cases ' + 
        'LEFT JOIN counselors ON counselors.user_uid=cases.counselor_id ' + 
        'WHERE cases.id=:case_id ';

        await sequelize.query(query, {
            replacements: { case_id: case_id },
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        }).then(cases =>{
            result.message = '개별 상담 조회 완료'
            if(cases[0]==null){
                result.message = '상담 내역이 하나도 없습니다.'               
            }
            result.success = true;
            result.data = cases;

        });

        // couselor name_formal 정보 & paper도 받아오기
        // const caseFound = await Case.findOne({
        //     where:{ id: case_id }
        // });
        // if(caseFound){
        //     result.success = true;
        //     result.message = '개별 상담 조회 완료'
        //     result.data = caseFound;
        // } else {
        //     result.success = false;
        //     result.message = '개별 상담 조회 실패'
        //     result.data = null;
        // }
        return res.status(200).json(result);        
        
    } catch (error) {
        console.error(error);
        next(error);       
    }

});

// 만료 날짜 구하기
function add_weeks(date, n) {
    return new Date(date.setDate(date.getDate() + (n * 7)));      
}

// 상담 케이스 생성 (결제 시)
// counselor_id, totalCase, discountRate, price, fk_user_uid 받아서 저장
// defaultValue(hasPaper, status, usedCase), nextCase는 따로 입력 안함
// status: 1 = 진행 중 / 2 = 예정 / 3 = 완료
router.post('/', isLoggedIn,  async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const {counselor_id, totalCase, price, discountRate } = req.body;
    let totalCase_int = parseInt(totalCase)
    if(user_uid==counselor_id) {
        result.success = false;
        result.data = null;
        result.message = "본인에게 상담을 신청할 수 없습니다."
        return res.status(200).send(result); 
    }
    let totalPrice = (price*totalCase_int)/100*(100-discountRate);
    console.log(`totalPrice = ${totalPrice}`);
    let date = new Date();
    console.log(`dateNow = ${date.toString()}`);
    //console.log(`expireDate = ${add_weeks(date, 2).toString()}`); 

    try {
        const newCase = await Case.create({
            counselor_id,
            totalCase: totalCase_int,
            totalPrice,
            expireDate: add_weeks(date, 2),
            fk_user_uid: user_uid
        });
        
        result.success = true;
        result.data = newCase;
        result.message = "상담 케이스 생성 성공"
        return res.status(200).send(result); 
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});





// 다음 상담 날짜 입력 (상담사)
router.patch('/nextCase', async(req, res, next)=>{
    try {
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

// 상담접수지 제출
router.patch('/paper/:case_id', async(req, res, next)=>{
    const case_id = req.params.case_id;
    const user_uid = req.user.user_uid;
    try {
        // user의 상담 접수지 찾기
        const paper = await Paper.findOne({
            where:{fk_user_uid: user_uid}, 
            attribute:[ 'id', 'isCompleted' ]
        });
        if(!paper.isCompleted){
            result.data = null;
            result.message = "상담 접수지 문항을 전부 채워주십시오.";
            result.success = false;
            return res.status(200).json(result);
        }
        // 찾은 상담 접수지 번호 case에 저장
        await Case.update({
            paper_id: paper.id
        }, {
            where: { case_id }
        });
        // 변경된 유저정보 보여주기 위해 조회
        result.data = await Case.findOne({
                where: {case_id}
        });
        result.message = "상담 접수지 제출 완료";
        result.success = true;
        return res.status(200).json(result);        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});




module.exports = router;
