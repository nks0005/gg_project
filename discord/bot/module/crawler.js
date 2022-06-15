const mysql2 = require("mysql2");
const https = require('https');

class crawler {
    constructor() {
        this.timeout = 10000; // 타임아웃 10초
    }

    async mustGetBodyByUrl(_url) {
        let body = ``;
        while (true) {
            try {
                body = await this.getBodyByUrl(_url);
                break;
            } catch (err) {
                console.error(err);
            }
        }
        return body;
    }

    async getBodyByUrl(_url) {
        return new Promise((resolve, reject) => {
            if (_url === undefined || _url === '') reject(`url 입력 값이 없습니다`);
            const req = https.request(_url, (res) => {
                let data = ``;

                res.on('data', (chunk) => { // murge datas
                    data += chunk.toString();
                });

                res.on('end', () => { // DATA EOF; 
                    if (res.statusCode === 200) { // success
                        resolve(JSON.parse(data));
                    } else { // fail
                        reject(`${_url} : ${res.statusCode} 에러 코드`);
                    }
                });
            });

            req.setTimeout(this.timeout, () => {
                reject(`${_url} : timeout`);
            });

            req.on('error', (err) => {
                reject(`${_url} : ${err} 에러 발생`);
            });

            req.end();
        });
    }
}

module.exports.crawler = crawler;