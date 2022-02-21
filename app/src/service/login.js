"use strict";

const jwtUtil = require('../util/jwtUtil');

const access = {
    user: async (req, res) => {
        const result = async () => {
            const fetch = (...args) => import('node-fetch')
                .then(({default: fetch}) => fetch(...args));
            const url = "http://localhost:8080/login";
            const params = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: req.body.id,
                    pw: req.body.pw,
                }),
            }

            return await fetch(url, params)
                .then(data => {
                    if (200 != data.status) return '계정정보가 일치하지 않습니다.';
                    let accessToken = jwtUtil.generateAccessToken(req.body.id);
                    let refreshToken = jwtUtil.generateRefreshToken(req.body.id);
                    return { accessToken, refreshToken };
                })
                .catch((err) => { return '오류입니다'; });
        }
        return result();
    }
}

module.exports = access;

