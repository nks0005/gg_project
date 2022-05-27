/*
server.js에서 서버를 실행하는 start() 함수를 만들어 지금까지 작성한 코드를 함수 내로 옮김
Global 변수 exports를 사용하여 start() 함수를 모듈로 등록

require() 전역 함수를 사용하면 .js 파일로 작성된 모듈로 로드할 수 있다.

모듈 분할로 파일이 2개로 나뉘어졌으나 기능상 변한건 없다. 그러나 단위 프로그램의 독립성은 확보된다

router.js를 만들어서 의존성 주입Dependency Injection을 만든다.


요청 관리자(Request Handler) 식별 - router.js에서 pathname의 요청을 handle할 handler - 실제 요청 처리를 Request Handler가 담당
 => 요청 식별과 요청 처리 모듈을 분리



*/

var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

server.start(router.route, requestHandlers.handle);