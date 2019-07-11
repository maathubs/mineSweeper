var express = require('express');
var router = express.Router();
var user_service = require('./services/user-service');

router.post('/login', (req, res) => {
    user_service.login(req, res);
})
router.post('/signup', (req, res) => {
    user_service.signup(req,res);
})   
router.post('/emailCheck', (req, res) => {
    user_service.emailCheck(req,res);
})   
router.post('/log', (req, res) => {
    user_service.log(req,res);
})

module.exports = router;