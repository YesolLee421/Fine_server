const express = require('express');
const router = express.Router();
const { Counselor } = require('../models');

// 추후 필터, 정렬 조건을 라우터밖에 저장해서 동시에 적용 가능하도록?
// 필터 초기화 따로 필요

// 모든 (검증된) 상담사 불러오기: 추후 인피니티 스크롤
router.get('/:sort/:filter', async (req, res, next)=>{
    const { sort, filter } = req.params;
    try {
        // req에 필터 조건도 받아야 함 {"gender":1, "count":100}..
        const counselors = await Counselor.findAll({
            where:{ isVerified: true }
            });
        //const counselors = await Counselor.findAll();    
        console.log("All counselors:", JSON.stringify(counselors, null, 2));
        let result = {
            success: true,
            data: '',
            message: ''
        }
        if(counselors[0]==null){
            result.message = '상담사가 하나도 없습니다.'
        }
        result.message = '상담사 전체 목록 조회 완료'
        result.data = counselors;
        return res.status(200).json(result);
        
    } catch (error) {
        console.error(error);
        next(error);       
    }
});

// 상담사 정렬

// 상담사 필터 초기화

// 상담사 한 명 상세보기
router.get('/:user_uid', async(req, res, next)=>{
    try {
        const user_uid = req.params.user_uid;
        const counselor = await Counselor.findOne({
            where: { user_uid }
        })
        let result = {
            success: true,
            data: '',
            message: ''
        }
        result.message = `user_uid=${user_uid}로 상담사찾기 성공`
        result.data = counselor;
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        let result = {
            success: false,
            data: '',
            message: ''
        }
        result.message = error;
        res.status(404).json(result);
        next(error);
    }
});






module.exports = router;