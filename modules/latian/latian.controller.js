const express = require('express');
const router = express.Router();
const db = require('../../helpers/db');
const jwt = require('jsonwebtoken');
const Latian = db.Latian;
const ResultLatian = db.ResultLatian;
const User = db.User;
// routes

router.post('/post/latianall', create);
router.get('/alllatian', getAll);
router.get('/latian', getById);
router.delete('/delete', _delete);
router.post('/post/latian', checkAnswer);
router.get('/resultlat', getResultLat);

module.exports = router;

async function create(req,res) {
    let soal = require('../../data/latian.json');

    let query = await Latian.insertMany(soal);
   
    let result = res.json(
        {
            "message" : "Success Post Soal" , 
            "code" : 200, 
            "data" : query
        }
    )
    return result
}

async function getAll(req, res) {
    let query = await Latian.find();
    let result = res.json(
        {
            "message" : "Success Get All Soal" , 
            "code" : 200, 
            "data" : query 
        }
    )
        
    return result
}

async function getById(req, res) {
    let model = {
        _id : req.query.id
    }

    let query = await Latian.findById(model._id);
    let result = res.json(
        {
            "message" : "Success Get by Id" , 
            "code" : 200, 
            "data" : query 
        }
    )
        
    return result   
}

async function _delete(req, res) {
    if(req.query.data === "latian") {
        let query = await Latian.remove();
        let result = res.json(
            {
                "message" : "Success Remove " , 
                "code" : 200, 
                "data" : query
            }
        )
        return result
    } else if(req.query.data === "result") {
        let query = await ResultLatian.remove();
        let result = res.json(
            {
                "message" : "Success Remove " , 
                "code" : 200, 
                "data" : query
            }
        )
        return result
    }
   
}

async function checkAnswer(req,res) {
    let model = {
        _id : req.query.id,
    }

    let getLatian = await Latian.findById(model._id);
    let payloadAnswer = req.body;
    let answer = [];

    getLatian.question.map( obj => {
        answer.push(obj.answer);
    })

    let isTrue = 0;
    let isFalse = 0;

    for(let i=0; i<answer.length; i++) {
        let valueAnswer = Object.values(payloadAnswer[i]);
        let keyAnswer = Object.keys(payloadAnswer[i])

        if(valueAnswer[0] === answer[i]) {
            isTrue ++
        } else {
            isFalse --
        }
    }

    let token = req.headers.authorization.replace('Bearer ','');
    
    let decode = jwt.decode(token);
    let userId = decode.sub

    let query = await User.findById(userId);
    
    function formatDate(date) {
        let d = new Date(date);
        let formatedDate, hours, minutes, milisecond, formatedTime;
      
        formatedDate = d.getFullYear() + "-" + ("0" + d.getMonth() + 1).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
        hours = ("0" + d.getHours()).slice(-2);
        minutes = ("0" + d.getMinutes()).slice(-2);
        milisecond = ("0" + d.getSeconds()).slice(-2);
      
        formatedTime = hours + ":" + minutes + ":" + milisecond
        return formatedDate + " " + formatedTime  
    }
  
      
    let resultAnswer = {
        "userId" : userId,
        "fullname" : query.fullname,
        "email" : query.email,
        "userAnswer" : payloadAnswer,
        "trueAnswer" : isTrue,
        "falseAnswer" : Math.abs(isFalse),
        "value" : isTrue * 10,
        "timestamp" : formatDate(new Date())
    }

    await ResultLatian.insertMany(resultAnswer)

    let result = res.json(
        {
            "message" : "Success Cleared Latihan" ,
            "code" : 204, 
            "data" : resultAnswer
        }
    )
    
    return result
}

async function getResultLat(req, res, next) {
    let query = await ResultLatian.find();
    let result = res.json(
        {
            "message" : "Success Get All Soal" , 
            "code" : 200, 
            "data" : query 
        }
    )
        
    return result
}