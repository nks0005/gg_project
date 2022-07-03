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
> 자체적으로 정적 파일 라우터 기능을 수행하기에, 최대한 위쪽에 배치하는것이 좋다.

# express-session
> 세션 관리용 미들웨어이다. express-generator로는 설치되지 않는다.
> npm i express-session

```js
var session = require('express-session');
...
var userRouter = require('./routers/users');

app.use(cookieParser('secret code'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret code',
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
```
> resave : 요청이 왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정
> saveUninitialized : 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
> secret : cookie-parser의 비밀키와 같은 역할
    > express-session은 세션 관리 시 클라이언트에 쿠키를 보내는데, 이를 세션 쿠키라고 부르며, 안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는 데 secret 값이 필요하다.

> cookie 옵션은 세션 쿠키에 대한 설정. maxAge, domain, path, expires, sameSite, httpOnly, secure...
> httpOnly : 클라이언트에서 쿠키를 확인하지 못하게
> secure : https 환경에서
> store : 이곳에 데이터베이스를 연결하여 세션을 유지. 레디스Redis가 자주 쓰인다.


# 템플릿. PUG

# 에러 처리 미들웨어
> error 객체는 시스템 환경이 development가 아닌 경우에만 표시. 배포 환경인 경우에는 에러 메시지가 표시되지 않는다. 에러 메시지가 노출되면 보안에 취약해지기 때문이다.

```js
app.user(function(err, req, res, next){
    res.locals.messgae = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});
```
> 에러 처리 미들웨어는 error라는 템플릿 파일을 렌더링한다. 렌더링시 res.locals.message와 res.locals.error에 넣어준 값을 함께 렌더링한다.


# Router 객체로 라우팅 분리하기
> 라우팅을 깔끔하게 관리가 가능하다.
> use 대신 get, post, put, patch, delete 같은 HTTP 메서드를 사용할 수 있다.
```js
app.use('/', function(req, res, next){
    // '/' 주소 요청일 때 실행된다. HTTP 메서드는 상관없다.
    next();
});

app.get('/', function(req, res, next){
    // GET 메서드 '/' 주소의 요청일 때만 실행된다.
    next();
});

app.post('/data', function(req, res, next){
    // POST 메서드 '/data' 주소의 요청일 때만 실행된다.
    next();
});
```

## 라우터 하나에 여러 개 장착이 가능하다. 일반적으로 미들웨어 전에 로그인 여부 또는 관리자 여부를 체크하는 미들웨어를 중간에 넣어두곤 한다.
```js
router.get('/', middleware1, middleware2, middleware3);
```

## 라우터 주소에는 특수한 패턴을 사용할 수 있다.
```js
router.get('/user/:id', function(req, res){
    console.log(req.params, req.query);
});
```
> /users/123?limit=5&skip=10
>> req:params : { id : '123' }
>> req.query : { limit:'5', skip:'10' }

>> 일반 라우터보다 뒤에 위치해야 한다. 다양한 라우터를 아우르는 와일드카드 역할을 하므로 일반 라우터보다 뒤에 있어야 다른 라우터들을 방해하지 않는다.

## 클라이언트에게 응답
> send, sendFile, json, redirect, render, ...
```js
res.send(버퍼 또는 문자열 또는 HTML 또는 JSON)
res.sendFile(파일 경로)
res.json(JSON 데이터)
res.redirect(주소)
res.render('템플릿 파일 경로', { 변수 })
```

> 기본적으로 200 HTTP 상태 코드를 응답.(res.redirect는 302). 직접 바꿀수도 있다. 
```js
res.status(404).send('Not Found');
```


## 마지막으로 라우터가 요청을 처리 못한다면?
> 404 처리 미들웨어를 수행 후
> 에러 처리 핸들러를 수행한다
```js
// 404 처리 미들웨어
app.use(function(req, res, next){
    next(createError(404));
});

// 에러 처리 핸들러
app.use(function(err, req, res, next){
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page 
    res.status(err.status || 500);
    res.render('error');
})

```

# 데이터베이스
> MySQL, NoSQL
> 데이터베이스를 관리하는 시스템을 DBMS(데이터베이스 관리 시스템)
```sql
CREATE SCHEMA nodejs;
use nodejs;

CREATE TABLE nodejs.users(
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    age INT UNSIGNED NOT NULL,
    married TINYINT NOT NULL,
    comment TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY(id),
    UNIQUE INDEX name_UNIQUE (name ASC)
)COMMENT = '사용자 정보', DEFAULT CHARSET=utf8, ENGINE=InnoDB;
```
> UNIQUE INDEX : 해당 값이 고유해야 하는지에 대한 옵션. 인덱스 이름은 name_UNIQUE, name 컬럼을 오름차순 ASC. UNIQUE INDEX의 경우 데이터베이스가 별도로 컬럼을 관리하므로 조회 시 속도가 빨라진다. PRIMARY KEY는 자동으로 UNIQUE INDEX를 포함한다.



```sql

```

# 시퀄라이즈 Sequelize
> 시퀄라이즈는 ORM; Object - relational Mapping으로 분류됨.
> 자바스크립트 구문을 알아서 SQL로 바꿔준다.
> express learn-sequelize --view=pug
> cd learn-sequelize
> npm i
> npm i sequelize mysql2
> npm i -g sequelize-cli : sequelize 커맨드를 사용하기 위해 전역 설치
> sequelize init : config, models, migrations, seeders 폴더 생성


# 모델 정의하기
> MySQL에서 정의한 테이블을 시퀄라이즈에서도 정의해야한다. ORM
> models/user.js

> 시퀄라이즈는 알아서 id를 기본 키로 연결하므로, id 컬럼은 적어줄 필요가 없다.
> 시쿨러이즈의 자료형
    > VARCHAR : STRING
    > INT : INTEGER,
    > TINYINT : BOOLEAN
    > DATETIME : DATE
    > INTEGER.UNSIGNED : UNSIGNED 옵션이 적용된 INT. ZEROFILL 옵션을 넣고 싶다면 INTEGER.UNSIGNED.ZEROFILL

> timestamps: false, // true면 createAt과 updateAt 칼럼을 추가한다. 
> paranoid는 timestamps가 true여야 사용가능하며, paranoid를 true할 경우 deletedAt 칼럼이 추가된다. 이 경우 로우를 삭제하는 시퀄라이즈 명령을 내렸을 때 로우를 제거하는 대신 deleteAt에 제거된 날짜를 입력한다. 로우를 조회할 경우 deletedAt값이 null인 로우를 조회한다.
    > deletedAt를 사용하는 이유는 백업을 위해서
> underscored 옵션은 createdAt, updateAt, deletedAt 컬럼과 시퀄라이즈가 자동으로 생성하주는 관계 칼럼들의 이름을 스네이크케이스 형식으로 바꾸어준다.
    > 스네이크케이스 변수 이름에 대문자 대신 _를 사용하는 방식으로. create_at, update_at, deleted_at가 된다.
> tableName 옵션은 테이블 이름을 다른 것으로 설정하고 싶을 때 사용. 시퀄라이즈는 자동으로 define 메서드의 첫 번째 인자를 복수형으로 만들어 테이블 이름으로 사용한다.

```sql
CREATE TABLE nodejs.comments(
	id INT NOT NULL AUTO_INCREMENT,
    commenter INT NOT NULL,
    comment VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT now(),
    PRIMARY KEY(id),
    INDEX commenter_idx (commenter ASC),
    CONSTRAINT commenter FOREIGN KEY (commenter) REFERENCeS nodejs.users (id) ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT='댓글', DEFAULT CHARSET=utf8, ENGINE=InnoDB;
```
> CONSTRAINT [제약 조건 명] FOREIGN KEY [컬럼명] REFERENCES [참고하는 컬럼명]
> 으로 외래키를 지정할 수 있다.

> ON UPDATE, ON DELETE는 모두 CASCADE로 설정. 사용자 정보가 수정되거나 삭제되면 그것과 연결된 댓글 정보도 같이 수정하거나 삭제한다는 뜻

> Comment 모델 : models/comment.js

> config 수정
    > operatorsAliases는 보안에 취약한 연산자를 사용할 지 여부를 설정하는 옵션

> 이 설정은 process.env.NODE_ENV가 development일 때 적용된다. 배포할때는 production으로 설정


# 관계 정의
> 1:1, 1:N: N:M 관계
## 시퀄라이즈에서 1:N 관계를 hasMany 라는 메서드로 표현
> N:1는 belongsTo
```js
db.User.hasMany(db.Comment, { foreignkey: 'commenter', sourceKey: 'id' }); // 1:N
db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' }); // N:1
```

## 1:1
> hasOne 메서드를 사용한다. 
```js
db.User.hasOne(db.Info, { foreignKey:'user_id', sourceKey:'id'});
db.Info.belongsTo(db.User, { foreignKey:'user_id', targetKey:'id'});
```

## N:M
> belongsToMany
```js
db.Post.belongsToMany(db.Hashtag, { through:'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through:'PostHashtag' });
```
> N:M에서는 데이터를 조회할 때 여러 단계를 거쳐야함. 노드 해시태그를 사용한 게시물을 조회하는 경우, 먼저 노드 해시 태그를 Hashtag 모델에서 조회하고, 가져온 태그의 아이디를 바탕으로 PostHashtag 모델에서 hasttagId가 1인 postId들을 찾아야함. 

### 시퀄라이즈는 이 과정을 편하게 할 수 있도록 몇가지 메서드를 지원함
```js
async(req, res, next) => {
    const tag = await Hashtag.find( { where: { title: '노드' } });
    const posts = await tag.getPosts();
};
```


# 시퀀스 INSERT
```sql
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
```
=> 
```js
const { User } = require('../models');
User.create({
    name: 'zero',
    age: 24,
    married: false, // 시퀄라이즈 모델에 정의한 자료형 대로 넣어야한다. 
    comment: '자기소개1',
});
```
> models 모듈에서 User 모델을 불러와 create 메서드를 사용하면 된다.

> 로우를 조회. 모든 데이터를 조회 findAll
SELECT * FROM nodejs.users;
=>
User.findAll ( {} );

> users 테이블의 하나만 가져오는 SQL
SELECT * FROM nodejs.users LIMIT 1;
=>
User.find( {} );


> 원하는 컬럼만 가져올 수 있음. attributes 옵션을 사용
SELECT name, married FROM nodejs.users;
=>
User.findAll( {
    attributes: ['name', 'married'],
});

> where 옵션이 조건들을 나열하는 옵션.
SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
=>
```js
const { User, Sequelize: { Op } } = require('../models');
User.findAll( {
    attributes: ['name', 'age'],
    where : {
        married: 1,
        age : { [Op.gt] : 30 },
    },
});
```

> Op.gt(초과), Op.gte(이상), Op.lt(미만), Op.lte(이하), Op.ne(같지 않음), Op.or(또는), Op.in(배열 요소 중 하나), Op.notIn(배열 요소와 모두 다름)
SELECT id, name FROM users WHERE married = 0 OR age > 30;
> Op.or 속성에 OR 연산을 적용할 쿼리들을 배열로 나열하면 된다.
```js
const { User, Sequelize: { Op } } = require('../models');
User.findAll({
    attributes : ['id', 'name'],
    where: {
        [Op.or] : [{
            married: 0,
        },
        {
            age :
            {
                [Op.gt]: 30
            }
        }],
    },
});
```

> 시퀄라이즈의 정렬 방식
SELECT id, name FROM users ORDER BY age DESC;
```js
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
});
```



> 조회할 로우 개수를 설정
> limit 옵션으로 설정
> offset 속성도 가능
SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
```js
User.findAll({
    attributes: ['id', 'name'],
    order: ['age', 'DESC'],
    limit: 1,
    offset: 1,
});
```


> 로우를 수정하는 쿼리
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
```js
User.update( {
    comment:'바꿀 내용',
}, {
    where: { id:2 },
});
```

> 로우 삭제
DELETE FROM nodejs.users WHERE id = 2;
```js
User.destory({
    where: {id : 2},
});
```

