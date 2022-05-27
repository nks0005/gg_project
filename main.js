const http = require('http');

const hostname = '127.0.0.1';
const port = 80;

const server = http.createServer(function(req, res){
    res.statusCode = 200;

    // res.end('Hello, World\n');

    console.log(`Someone Connect : ${req}`);
    const body = 'Hello, World s\n';
    res.writeHead(200, {
        'Content-Length' : Buffer.byteLength(body),
        'Content-Type' : 'text/plain'
    }).end(body);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})


/*

const http = require('http');
> require는 C언어의 #include 와 같은 기능을 한다. return 값을 가진다.
'http'라는 모듈이 가진 라이브러리를 http 변수에 객체를 담음

const hostname = '127.0.0.1';
const port = 80;
> '127.0.0.1'이라는 주소[localhost]와 포트 80

const server = http.createServer(function(req, res){ ... });
> http 객체의 method 중 하나인 createServer를 이용하여 서버를 생성
    http.createServer([options][, requestListener])
    > requestListener는 <Function>을 이용한다. argument로 request, response를 가지고 있다.
    res의 statusCode 값이 200 = OK 사인




*/