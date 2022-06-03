// nodejs에서 비동기를 동기처럼 사용하기

function workP(sec) {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve('workP function');
        }, sec * 1000);
    });
}



async function asyncFunc() {
    const result_workP = await workP(3);
    console.log(result_workP);
    return 'async function';
}

//asyncFunc().then((result) => {
//    console.log(result)
//});
// 출처: https: //ebbnflow.tistory.com/245 [삶은 확률의 구름:티스토리]

// DB 비동기 쿼리를 동기화

const db = require('../restapi/db');

async function dbSyncFunc() {
    db.con.connect();

    var sql = `
    SELECT * 
    FROM battlelog
    WHERE totalplayers = 10
    `;
    await db.con.query(sql, function(err, result, fields) {
        if (err) throw err;
        console.log("end db");
    });
    return "end dbSyncFunc()";
}

dbSyncFunc().then((result) => {
    console.log(result);
    db.con.end();
});