const express = require('express');
const session = require('express-session');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

const fileStore = require('session-file-store')(session);
const app = express();

//Middle Ware list
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    store : new fileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

//사용자 정보 세션 읽기, 쓰기
passport.serializeUser(function(user, done) {   //쓰기
    done(null, user.email);
});

passport.deserializeUser(function(id, done) {   //읽기
    done(null, id);
});

//메인 페이지
app.get('/',(req,res)=>{
    let page = getPage('Passport','This is Passport Example Page',authInfo(req));
    res.send(page);
});

//로그인 페이지
app.get('/login',(req,res)=>{
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

//로그인 인증 (Passport)
passport.use(new LocalStrategy({
        //로그인 페이지 input 태그 내 name
        usernameField: 'email',
        passwordField: 'password'
    },
    (id, password, done)=>{
        console.log(id,password);
        //회원 정보가 한개이상 있을때
        if(user){
            console.log(user);

            //여기에서 토큰 요청


            //아이디나 비밀번호가 다를 때. 보안 때문에 아이디/비밀번호 각각 미일치 여부를 보내주지 않음
            if ((id !== user.email) || (password !== user.password))
                return done(null, false, { message: '아이디가 다르다' });
            //아이디, 비밀번호 모두 맞을 경우
            return done(null, user);
        }
    }));

//로그인 처리 (Passport)
app.post('/login',
    passport.authenticate('local', {
        //성공시, 메인페이지 이동
        //실패시 로그인 페이지 이동
        successRedirect: '/',
        failureRedirect: '/login'
    }));


//회원가입 페이지 Get
app.get('/join',(req,res)=>{
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

//회원가입 처리 Post : 예제를 위해 간단 저장 방식으로 구현
var user = {};
app.post('/join',(req,res)=>{
    user.email = req.body.email;
    user.password = req.body.password;
    user.name=req.body.name;
    //로그인 페이지로 이동
    res.redirect('/login');
});

//로그 아웃 처리
app.get('/logout',(req,res)=>{
    //passport 정보 삭제
    req.logout();
    //서버측 세션 삭제
    req.session.destroy(()=>{
        //클라이언트 측 세션 암호화 쿠키 삭제
        res.cookie('connect.sid','',{maxAge:0});
        res.redirect('/');
    });
});

const resultUser = async () => {

    const xxx = async () => {
        const fetch = (...args) => import('node-fetch')
            .then(({default: fetch}) => fetch(...args));

        const url = {
            method: "POST",
            // url: "http://localhost:8080/login",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: "admin",
                pw: "1234",
            }),
        }

        return await
        fetch("http://localhost:8080/login",url)
            // .then(data => data.json())
            .then(data => {
                if (200 != data.status) return '계정정보가 일치하지 않습니다.';
                // let accessToken = data.accessToken;
                // let refreshToken = data.refreshToken;
                // console.log('accessToken: ', accessToken);
                // console.log('refreshToken', refreshToken);
                return '정상';
            })
            .catch((err) => {
                return '오류입니다';
            });
    }

    return xxx();
}

app.get("/test", (req, res) => {
    console.log('test 시작');
    const user = async () => { return await resultUser(); }
    return user()
        .then((data) => { res.send(data);})
})

//포트 연결
app.listen(3000,()=>console.log(`http://localhost:3000`));


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