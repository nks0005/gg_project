// npm install -S mysql2

/*
기존 mysql로는 비동기 로직을 구성하기가 매우 어려웠다.
방법을 찾아 검색 도중 npm promise-mysql 모듈을 이용하면 된다고 하지만
mysql2 모듈을 이용하는것도 좋아 보인다.

mysql2?

NODE JS에서 DB 연결을 할때 mysql는 콜백 함수 기반으로 되어있기에 promise를 사용하기 어렵다. npm promise-mysql 별도의 모듈을 깔아야함
mysql2는 promise를 지원하기에 다른 모듈이 필요 없다
https://ukcasso.tistory.com/64



아래 코드 
https://velog.io/@savin/Node.js-MySQL2-%EB%AA%A8%EB%93%88
https://blog.naver.com/PostView.nhn?blogId=psj9102&logNo=221777739584&categoryNo=40&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView
*/

const mysql = require('mysql2');

// 데이터베이스 연결 사전 작업
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crawl'
});

// 비동기를 동기처럼 테스트 함수
const result = async() => {

    // 데이터베이스 연결
    con.connect();

    try {
        const [row] = await con.promise().query("SELECT * FROM battlelog;");
        console.log(row);
    } catch (e) {
        throw new Error(e);
    } finally {
        con.end();
    }
}

result();