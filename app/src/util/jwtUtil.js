"use strict";

// access token을 secret key 기반으로 생성
const jwt = require("jsonwebtoken");
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "180 days",
    });
};

module.exports = {
    generateAccessToken
    ,generateRefreshToken
}