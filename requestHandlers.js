/*
requestHandler.JPG

router.js는 요청을 식별
requestHandler는 식별된 요청에 대한 처리 핸들러

응답 값 까지 전달한다. 
*/

function response_body(response, body){
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.write(body);
    response.end();
}

function view(response) {
    console.log('request handler called --> view');
    response_body(response, "Hello View");
}

function create(response) {
    console.log('request handler called --> create');
    response_body(response, "Hello Create");
}

var handle = {};
handle['/'] = view;
handle['/view'] = view;
handle['/create'] = create;

exports.handle = handle;