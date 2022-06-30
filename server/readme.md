# RESTful server.

기존 헬게이터 봇을

RESTful 서버
디코 봇

으로 분리시켜 관리를 용이하게 한다.

## RESTful 서버
albion online의 api를 이용하여 킬 보드 데이터 내역을 DB에 저장한다.
디코 봇이 데이터를 요청하면 반환해준다.

express 프레임워크를 이용한다.

## 요청과 응답
클라이언트는 서버로 요청(Request)를 보내고
서버는 요청 내용을 읽고 처리한 뒤 클라이언트에게 응답(Response)을 보낸다.


http 모듈에는 createServer 메서드가 있으며, 이를 통해 인자에 대한 콜백함 수를 넣을 수 있다.
```js
const http = require('http');

http.createServer((req, res) => {
    // 응답할 때 실행되는 콜백 함수 구간
});
```

req 객체는 요청에 관한 정보
res 객체는 응답에 관한 정보

아래는 응답을 보내는 부분과 서버 연결 부분을 추가
```js
const http = require('http');

http.createServer((req, res)=>{
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>hello Server!</p>');
}).listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다.!');
});
```

이 방법 말고도 listening 이벤트 리스너를 붙여도 된다.
```js
const http = require('http');

const server = http.createServer((req, res) => {
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
});

server.listen(8080);
server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기 중입니다.!');
});
server.on('error', (err) => {
    console.error(err);
});
```

res 객체에는 res.write, res.end 메서드가 있다.
res.write의 첫 번째 인자는 클라이언트로 보낼 데이터이다.
res.end는 응답을 종료하는 메서드이다. 만약 인자가 있다면 그 데이터도 클라이언트로 보내고 응답을 종료한다.

# HTTP 상태 코드
> 2XX : 200(성공) 201(작성됨)
> 3XX : 리다이렉션. 301(영구이동) 302(임시이동)
> 4XX : 요청 오류. 401(권한없음) 403(금지됨) 404(찾을수없음)
> 5XX : 서버 오류. 500(내부서버오류) 502(불량게이트웨이) 503(서비스를 사용할 수 없음)


# 헤더와 본문
> 요청과 응답은 모두 헤더와 본문을 가지고 있다.
> 헤더는 요청 또는 응답에 대한 정보를 가지고 있다.
> 본문은 서버와 클라이언트 간에 주고 받을 실제 데이터를 담아두는 공간이다.
> 쿠키는 헤더에 저장


# 쿠키
> 쿠키명=쿠키값 : 전형적인 쿠키의 값. mycookie=test, name=zerocho
> Expires=날짜 : 만료 기한. 이 기한이 지나면 쿠키가 제거된다.
> Max-age=초 : Expires와 비슷하지만 날짜 대신 초를 입력할 수 있다
> Domain=도메인명 : 쿠키가 전송될 도메인을 특정할 수 있다.
> Path=URL : 쿠키가 전송될 URL을 특정할 수 있다.
> Secure : HTTPS 경우에만 쿠키가 전송된다
> HttpOnly : 자바스크립트에서 쿠키에 접근할 수 없다.


# REST API와 라우팅
요청이 주소를 통해 들어오는데 서버가 이해하기 쉬운 주소를 사용하는 것이 좋기에 REST API가 등장
REST API : REpresentational State Transfer의 약어로 네트워크 구조의 한 형식.
> 서버의 자원을 정의하고, 자원에 대한 주소를 지정하는 방법을 가리킨다.
> /user 이라면 사용자 정보에 관련된 자원을 요청하는 것
> /post 이라면 게시글에 관련된 자원을 요청하는 것

> HTTP 요청 메서드를 사용한다. GET POST PUT PATCH DELETE (CRUD)
    > GET : 서버 자원을 가져오고자 할 때 사용. 요청의 본문body에 데이터를 넣지 않는다. 대신 쿼리스트링을 이용. R
    > POST : 서버에 자원을 새로 등록하고자 할 때 사용. 요청의 본문body에 새로 등록할 데이터를 넣어 보낸다. C
    > PATCH : 서버 자원의 일부만 수정하고자 할 때 사용. 요청의 본문에 일부 수정할 데이털르 넣어 보낸다. U
    > DELETE : 서버의 자원을 삭제하고자 할 때 사용 D

> 주소와 메서드만 보고 요청의 내용을 명확하게 알아 볼 수 있다는 것이 장점.
> GET 메서드 같은 경우, 브라우저에서 캐싱할 수 도 있기에 성능이 좋아진다.


# https, http2
> https 모듈은 웹 서버에 SSL 암호화를 추가. GET POST 요청을 할 때 오고 가는 데이터를 암호화해서 중간에 다른 사람이 요청을 가로채더라도 내용을 확인할 수 없게 한다.
> https는 인증서를 발급받아야 한다.

# 클러스터cluster
> 싱글 스레드인 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈. 포트를 공유하는 노드 프로세스를 여러 개 둘 수 있다.
> 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수만큼 요청이 분산되게할 수 있다.
> 세션을 공유하지 못하는 등의 단점이 있다. Redis로 해결이 가능


# Express 서버 만들기
## Express-generator
> 기본 폴더 구조까지 잡아주는 패키지
> npm i -g express-generator
> express learn-express --view=pug
> cd learn-express
> npm install

## 폴더 구조
> app.js : 핵심적인 서버 역할
> bin/www : 서버를 실행하는 스크립트
> public 폴더는 외부에서 접근 가능한 파일들을 모아둔 곳. images, javascripts, stylesheets.
> routes : 주소별 라우터
> views : 템플릿 파일

> 서버의 로직은 routes 폴더의 파일에
> 화면 부분은 views 폴더 안에
> 데이터베이스는 models 폴더를 만들어 그 안에 작성
>> 이 방식은 구조가 명확하게 구분되어 있어 서버를 관리하기 용이하며, MVC 패턴과도 비슷하다. ( 라우터가 컨트롤러라면 )

## 미들웨어
> 미들웨어는 요청과 응답의 중간에 위치
> 요청과 응답을 조작하여 기능을 추가하기도 하고, 나쁜 요청을 거른다

> 커스텀 미들웨어
```js
...
app.user(function(req, res, next){
    console.log(req.url, '저도 미들웨어입니다.');
    next();
});
```
> next()를 넣어야 다음 미들웨어로 넘어간다.
### next
> next() => 다음 미들웨어로
> next('route') => 다음 라우터로
> next(error) => 에러 핸들러로


# morgan
> 콘솔에 나오는 
GET / 200 199.942 ms - 170
GET /stylesheets/style.css 200 4.275 ms - 111
> 이 로그는 morgan 미들웨어에서 나오는 것.
```js
var logger = require('morgan');

app.use(logger('dev'));
```
> 'dev' 대신 'short', 'common', 'combined' 등을 줄 수 있다.
> 개발에는 dev, short. 배포시는 common, combined.

# body-parser
> 요청의 본문을 해석해주는 미들웨어. 폼 데이터나 AJAX 요청의 데이터를 처리

```js
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
```
> express 4.16.0 버전부터 body-parser 일부 기능이 내장되어 있다. 그렇기에 아래처럼 사용함

```js
app.use(express.json());
app.use(express.urlencoded({extended:false}));
```
> post와 put 요청의 본문을 전달받으려면 req.on('data')와 req.on('end')로 슽트림을 사용해야 했지만, body-parser를 사용하면 그럴 필요가 없다.
> 이 패키지가 내부적으로 본문을 해석해 req.body에 추가한다.

> express.json : {name:'zerocho', book:'nodejs'}를 본문으로 보낸다면 req.body에 들어간다.
> express.urlencoded : URL-encoded형식으로 name=zerocho&book=nodejs를 본문으로 보낸다면 req.body에 {name:'zerocho', book:'nodejs'} 형태로 들어간다.

# cookie-parser
> 요청에 동봉된 쿠키를 해석해준다. 
> req.cookies 객체에 들어간다.

# static
> static 미들웨어는 정적인 파일들을 제공한다.
```js
app.use(express.static(path.join(__dirname, 'public')));
```