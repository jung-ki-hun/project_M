var express = require("express");
var http = require('http'); // node 내장 모듈 불러옴 
var static = require('serve-static');// 특정 폴더의 파일들을특정 패스로 접근할 수 있도록 만들어주는 외장 모듈
var path = require('path');//경로
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ip ="203.241.228.134";//서버주소
var app = express();

var errorHandler = require('errorhandler');
var expressErrorHandler =require('express-error-handler');

var expressSession = require('express-session');//세션


var mongoClient = require('mongodb').MongoClient;

var database;//데이터 베이스 
function connectDB(){
	var databaseURL ="";
	mongoClient.connect(databaseURL, function(err,cluster){
		if(err){
			console.log('db connect error');
		}
		console.log('db was connected : '+ databaseURL);

		database =cluster.db('test');
	})
}


app.set('port', process.env.PORT || 3000);//3000번 포트 개방
app.use('/views', static(path.join(__dirname, 'views')));//--dirmane : js 파일이 있는 폴더경로

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(expressSession({
	secret:'my key',
	resave:true,
    saveUninitialized:true
    //store:db 관련 저장소 운영
}));// 저장할 정보에 대해서 어떻게 할지..

var router = express.Router();
/*
// router.route('/process/login').post(function(req,res){
//     console.log("/process/login 라우팅 함수에서 받음.");

//     var paramId = req.body.id ||req.query.id;
//     var paramPassword = req.body.password || req.query.password;
//     res.writeHead(200,{"content-Type":'text/html;charset=utf8'});//200 정상응답  
//     res.write("<p>"+paramId+paramPassword+"</p>");
//     res.end();
// })*/

// 로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 호출됨.');

	var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;
	
	if (req.session.user) {
		// 이미 로그인된 상태
		console.log('이미 로그인되어 상품 페이지로 이동합니다.');
		
		res.redirect('/views/index.html');//로그인 되면 보여줄 화면..
	} else {
		// 세션 저장
		req.session.user = {
			id: paramId,
			name: '소녀시대',
			authorized: true
		};//db 만들어서 가져 와야 될 코드
		/*
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h1>로그인 성공</h1>');
		res.write('<div><p>Param id : ' + paramId + '</p></div>');
		res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
		res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
		res.end();*/
		
		// 홈페이지창에 표시하는 기능 추후 수정
		// 수정 예정안
		// 서버 콘솔창에 표시 -> 접속자 ip, 식별자, 성공여부
	}
});
// 로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res) {

	console.log('/process/logout 호출됨.');
	
	if (req.session.user) {
		// 로그인된 상태
		console.log('로그아웃합니다.');
		
		req.session.destroy(function(err) {
			if (err) {throw err;}
			
			console.log('세션을 삭제하고 로그아웃되었습니다.');
			res.redirect('/views/index.html');
		});
	} else {
		// 로그인 안된 상태
		console.log('아직 로그인되어있지 않습니다.');
		
		res.redirect('/views/index.html');
	}
});

// 상품정보 라우팅 함수 //수정필수
router.route('/process/product').get(function(req, res) {
	console.log('/process/product 호출됨.');
	
	if (req.session.user) {
		res.redirect('/public/product.html');
	} else {
		res.redirect('/public/login2.html');
	}
});//로그인 상태일때 접속하게 해야됨!!



// 회원 가입 라우팅 함수
router.route('/process/newacc').get(function(req, res) {
	console.log('/process/newacc 호출됨.');
	
	if (req.session.user) {
		res.redirect('/public/product.html');
	}//로그인 상태 //추후 로그인 관련해서 알아보기
	else {
		res.redirect('./views/NewAccount.html');
	}//비로그인 상태

});//로그인 상태일때 접속하게 해야됨!!



app.use('/',router);
/*
app.all('*',function(req,res){
    res.status(404).send('<h1>요청하신 서버에 접속 할 수가 없습니다.</h1>');
});//서버 오류 출력 구문
*/
var errorHandler = expressErrorHandler({
	static: {
		'404':'./views/error/404.html;'
	}
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);//오류


app.use(function (req, res, next) {
    console.log('첫 미들웨어 메인페이지 응답'+req.ip);
    res.writeHead(200,{"content-Type":'text/html;charset=utf8'});//200 정상응답  
    res.end('<h1>서버 정상 가동중</h1>');//서버가 오픈되어있다고 
    //res.redirect('http://203.241.228.134:3000/views/index.html');//메인페이지로 가는것
    
    next();
});// 서버 정상가동 확인 및 접속자 ip 출력




http.createServer(app).listen(app.get('port'),ip, function () {

    console.log('서버 시작됨');
});
