const express = require('express');
const router = express.Router();
const io = require('../app').io;
// 모델
const { Case, Counselor, User, Paper, Message } = require("../models");
// 미들웨어
const { isLoggedIn, isNotLoggedIn,
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers } = require('./middlewares');
// response 형식
let result = {
    success: false,
    data: null,
    message: ''
}

// 채팅 메시지 전체조회

router.get('/:case_id', isLoggedIn, async (req, res, next)=>{
    const case_id = req.params.case_id;

    try {
        const messages = await Message.findAll({
            where:{ fk_case_id: case_id }
        });
        //const counselors = await Counselor.findAll();    
        console.log("All message:", JSON.stringify(messages, null, 2));

        result.success = true;
        result.message = '채팅 전체 조회 완료'
        result.data = messages;
        return res.status(200).json(result);
        
    } catch (error) {
        console.error(error);
        next(error);    
    }
});


module.exports = router;