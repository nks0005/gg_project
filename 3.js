/*
addListener()을 이용할 수도 있다
*/

var http = require('http');

var server = http.createServer();

server.addListener('request', function (request, response) {
    console.log('requested...');
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Hello node js');
    response.end();
});

server.addListener('connection', function (socket) {
    console.log('connected...');

});

server.listen(8080);

/*
addListener 방법을 사용하면 더 다양한 이벤트를 처리할 수 있다.
요청 이벤트인 'request'와 클라이언트 접속 이벤트인 'connection'을 따로 처리 할 수 있다.
*/


/*
Node.js는 서버에서 발생한 모든 이벤트를 비동기로 처리한다.
    IO 처리에 대한 Blocking을 방지하기 위함

IO 중 Disk 혹은 Network Access 시 비용이 많이 발생한다
    해결하기 위한 방안?
    1. Multi-Thread 방식을 이용한다 = 클라이언트 요청마다 Thread를 발생시킨다면 메모리 자원이 많이 사용된다. 
    => 동기 처리 방식에서 비동기 처리 방식으로
        동기 처리 방식은 하나의 요청이 처리되는 동안 다른 요청이 처리되지 못하며 요청이 완료되어야만 다음 처리가 가능한 방식 => 처리할때 IO를 Blocking을 하기에 Thread로 처리
        -> 이 문제를 비동기 방식으로 처리. 비동기 방식은 하나의 요청 처리가 완료되기 전에 제어권을 다음 요청으로 넘긴다 = IO 처리인 경우 Blocking되지 않는다 

Node.js는 비동기 IO를 지원하며 Single-Thread 기반으로 동작하는 서버
    => 병렬 처리를 Thread로 하지 않기에 Multi-Thread의 문제에서 자유롭다. 
    => 이벤트 방식으로 처리한다. 서버 내부에서 이벤트 메시지를 Event Loop가 처리하며 Event Loop가 처리하는 동안 제어권은 다음 요청으로 넘어가고 처리가 완료되면 Callback을 호출하여 호출 측에게 통지한다.

    Event Loop는 요청을 처리하기 위하여 내부적으로 약간의 Thread와 프로세스를 사용 => 요청 처리 자체가 아닌 내부 처리 목적으로만 사용되기에 Multi-Thread 방식의 서버에 비하여 Thread 수와 오버헤드 수가 적다.
    ==> 이벤트 처리하는 Event Loop는 Single-Thread로 이루어져 있기에 처리 작업 자체가 오래걸리면 전체 서버 처리에 영향을 준다 => Node js의 치명적인 약점

Node js는 Google Chrome V8 엔진 기반으로 동작 
내부의 Event Loop는 Single-Thread 기반에서 비동기 메시지를 처리
=> 이러한 Event Loop는 고성능 병렬 처리를 보장. 이벤트에 의해 처리해야 할 단위 작업이 아주 짧은 시간 안에 처리된다면 Node js의 고성능의 장점을 극대화 가능하다

Node js를 사용할때 개발자는 비동기 프로그래밍을 해야한다.

비동기 방식 예
*/

var fs = require('fs');

// non-blocking code
fs.readdir('.', function (err, filenames) {
    // callback
});

console.log('can process next job...');


// 동기 방식 예 
var fs = require('fs');

var filenames = fs.readdirSync('.');
var i;
for (i = 0; i < filenames.length; i++) {
    console.log(filenames[i]);
}
console.log('ready');

/*
비동기 프로그램에서 순차 처리
-> callback을 이용하여 순차 처리를 하면 된다.

동기, 비동기 순차 처리 예제
*/

var fs = require('fs');

var oldFilename = './processid.txt';
var newFilename = './processOld.txt';

fs.chmodSync(oldFilename, 777);
fs.renameSync(oldFilename, newFilename);
var isSymLink = fs.lstatSync(newFilename).isSymbolicLink();



fs.chmod(oldFilename, 777, function (err) {
    fs.rename(oldFilename, newFilename, function (err) {
        fs.lstat(newFilename, function (err, stats) {
            var isSymLink = stats.isSymbolicLink();
        })
    })
});

/* callback을 중첩하면 코드의 Depth가 너무 깊어지기에 가독성이 떨어진다. 
이를 해결해주는 프레임워크 = async 모듈
*/

// npm install async

var fs = requite('fs');
var async = require('async');

var oldFilename = './processId.txt';
var newFilename = './processIdOld.txt';

async.waterfall([
    function (cb) {
        fs.chmod(oldFilename, 777, function (err) {
            console.log('complete chmod');
            cb(null);
        });
    },
    function (cb) {
        fs.rename(oldFilename, newFilename, function (err) {
            console.log('complete rename.');
            cb(null);
        });
    },
    function (cb) {
        fs.lstat(newFilename, function (err, stats) {
            var isSymLink = stats.isSymbolicLink();
            console.log('complete symbolic check.');
        });
    }
]);


/*
Node js는 비동기 방식이지만 Event Loop에서 처리되는 작업이 긴 시간을 요구하는 경우 전체 서버 성능이 저하 되기에
전달할 이벤트 들을 잘게 쪼개어 병렬로 처리될 수 있게 유도해야한다.
*/

var fs = require('fs');

function calculateBytes() {
    var totalBytes = 0, i, filenames, stats;

    filenames = fs.readdirSync('.');

    for (i = 0; i < filenames.length; i++) {
        stats = fs.statSync('./' + filenames[i]);
        totalBytes += fs.stats.size;
    }
    console.log(totalBytes);
}
calculateBytes();

// 위의 동기 방식을 아래 비동기 병렬 방식으로 

var fs = require('fs');

function calculateBytes() {
    fs.readdir('.', function (err, filenames) {
        var count = filenames.length;
        var totalBytes = 0;
        var i;

        for (i = 0; i < filenames.length; i++) {
            fs.stat('./' + filenames[i], function (err, stats) {
                totalBytes += stats.size;
                count--; // 병렬 처리 할 경우 언제 작업이 완료되는지 모르기에 count 변수를 이용
                if (count == 0) {
                    console.log(totalBytes);
                }
            });
        }
    });
}

/* 
callback 의 호출 시점은 
runtime에 들어가면 외부 로직과 callback은 event loop에 의해 처리되므로 어느것이 먼저 실행될지 모른다

그렇기에 호출된 시점에 값을 저장해야 한다
*/

var fs = require('fs');

function executeCallbacks() {
    fs.readdir('.', function (err, filenames) {
        var i;
        for (i = 0; i < filenames.length; i++) {
            (function () {
                var j = i;
                fs.stat('./' + filenames[i], function (err, stats) {
                    console.log(j + ':' + stats.isFile());
                });
            });
        }
    });
}