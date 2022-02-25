"use strict";

const express = require('express');
const router = express.Router();

router.get('/',(req, res)=>{
    let page = getPage('Passport','This is Passport Example Page',authInfo(req));
    res.send(page);
});

//로그인 페이지
router.get('/login',(req,res)=>{
    let page =  getPage('로그인',`
    <form action="/login" method="post">
        <input type="text" name="email" placeholder="email"><br>
        <input type="password" name="password" placeholder="****"><br>
        <div style="display : flex;justify-content:space-between;width: 153px;">
            <input type="submit" value="로그인" style="display:inline-block;">
            <a href="/join" style="background : #E5E5E5;padding : 2px; border: 0.5px solid black;cursor:pointer;border-radius:3px;font-size:13px;color:black;text-decoration:none;">회원가입</a>
        </div>
    </form>
    `,`<a href="/">뒤로가기</a>`);
    res.send(page);
});

//로그인 처리 (Passport)
router.post('/login',(req, res) => {
    res.redirect('/');
});


//회원가입 페이지 Get
router.get('/join',(req,res)=>{
    let page = getPage('회원가입',`
    <form action="/join" method="post">
        <input type="email" name="email" placeholder="email"><br>
        <input type="password" name="password" placeholder="****"><br>
        <input type="name" name="name" placeholder="이름"><br>
        <input type="submit" value="회원가입"><br>
    </form>
    `,'<a href="/login">뒤로가기</a>');
    res.send(page);
});

//로그 아웃 처리
router.get('/logout',(req,res)=>{
    //passport 정보 삭제
    req.logout();
    //서버측 세션 삭제
    req.session.destroy(()=>{
        //클라이언트 측 세션 암호화 쿠키 삭제
        res.cookie('connect.sid','',{maxAge:0});
        res.redirect('/');
    });
});



//로그인 로그아웃 여부
const authInfo = (req)=>{
    if(req.user) return `${user.name} | <a href="/logout">로그아웃</a>`;
    return `<a href="/login">login</a>`;
}

//페이지 템플릿
const getPage = (title, content, auth) =>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Passport Example</title>
    </head>
    <body>
    ${auth}
        <h1>${title}</h1>
        <p>${content}</p>
    </body>
    </html>
    `;
}

module.exports = router;