/*
http server는 다양한 사용자 요청에 응답해야 한다. 
조회, 저장 등 
-> server.js가 수행하기에는 범위가 너무 넓다. 다양한 요청을 식별하는 router 모듈 개발
*/

function route(handle, pathname, response){
    console.log('about to route a request for ' + pathname);

    if(typeof handle[pathname] === 'function'){
        handle[pathname](response);
    }
    else{
        console.log('no request handler found for ' + pathname);
        response.writeHead(404, {'Content-Type' : 'text/plain'});
        response.write('404 Not found');
        response.end();
    }

}

exports.route = route;

