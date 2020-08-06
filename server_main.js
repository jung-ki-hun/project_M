var express = require("express");
var http = require('http'); // node 내장 모듈 불러옴 
var static = require('serve-static');// 특정 폴더의 파일들을특정 패스로 접근할 수 있도록 만들어주는 외장 모듈
var path = require('path');//경로
var bodyParser = require('body-parser');
var app = express();



//res 응답 req 요청
/*
user_data =JSON.stringify(data);
*/




app.set('port', process.env.PORT || 3000);
app.use('/views', static(path.join(__dirname, 'views')));//--dirmane : js 파일이 있는 폴더경로
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log('첫 미들웨어 메인페이지 응답');
    res.writeHead(200,{"content-Type":'text/html;charset=utf8'});//200 정상응답  
    res.end('<h1>dfsfsdfsf</h1>');
    // var userAgent = req.header('User-Agent');
    // var paramName = req.body.id || req.query.id;//get방식과 포스트 방식으로 있다//id 값 가져오는 구문 
    // res.send(paramName);
    next();
});
/*
app.use(function (req, res, next) {
    console.log('둘 미들웨어 메인페이지 응답');

    res.redirect('views/index.html');
    //next();
});//메인 페이지 호출

*/
/*
app.use(function(req,res,next){
   console.log('첫 미들웨어 메인페이지 응답');
   
       
   // res.send(views/index.html);
});*/


http.createServer(app).listen(app.get('port'), function () {
    console.log('서버 시작됨');
});