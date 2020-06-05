const express = require('express');
const router = express.Router();
const { User, Counselor } = require('../models');

// get user list
router.get('/', async (req, res, next)=>{
    try{
        const users = await User.findAll();
        console.log("All users:", JSON.stringify(users, null, 2));
        let result = {
            success: true,
            data: '',
            message: ''
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
router.post('/register', (req, res, next)=>{

});


// login
router.get('/login', (req, res, next)=>{

});


// logout
router.get('/logout', (req, res, next)=>{

});




module.exports = router;