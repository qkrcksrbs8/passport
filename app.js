const express = require('express');
const bodyParser = require("body-parser");
const app = express();
process.env.ACCESS_TOKEN_SECRET='pcg_qweqsdaasdqweasedwqdsadczxdcz';
process.env.REFRESH_TOKEN_SECRET='pcg_zxcasdqwexzczxdqeqwdzxcasdqwe';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = require('./app/src/routes/index');
// const login = require('./app/src/routes/login');
// app.use('/', login);
app.use('/access', router);

//Middle Ware list
app.use(express.urlencoded({extended:false}));

// // access token을 refresh token 기반으로 재발급
// app.post("/refresh", (req, res) => {
//     let refreshToken = req.body.refreshToken;
//     if (!refreshToken) return res.sendStatus(401);
//
//     jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//         (error, user) => {
//             if (error) return res.sendStatus(403);
//             const accessToken = generateAccessToken(user.id);
//             res.json({ accessToken });
//         }
//     );
// });

//포트 연결
app.listen(3000,()=>console.log(`http://localhost:3000`));

