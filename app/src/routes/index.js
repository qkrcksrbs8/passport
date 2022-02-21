"use strict";

const express = require('express');
const router = express.Router();
const loginService = require('../service/login');

router.get('/access', (req, res) => {
    console.log('access 시작');
    const user = async () => { return await loginService.user(req); }
    return user().then((data) => { res.send(data);})
})

module.exports = router