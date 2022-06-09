const https = require('https'); // https 사이트 크롤링을 위한 모듈

class Mutex {
    constructor() {
        this.lock = false;
    }

    sleep(ms) {
            return new Promise(resolve => {
                setTimeout(resolve, ms);
            })
        }
        // https://lahuman.github.io/nodejs_sleep_inside_for/

    async use() {
        while (true) {
            if (this.lock === false) {
                break;
            }
            await this.sleep(100);
        }

        this.lock = true;
    }

    release() {
        this.lock = false;
    }
}
// https://changmyeong.tistory.com/54

class analysis {
    constructor() {
        this.updateAllCount = 20; // 한번의 updateAll 함수에서 업데이트할 킬보드 수

        this.arrTotal = new Array(); // 모든 킬보드 정보를 담을 배열
        this.mutex = new Mutex(); // 비동기 처리 중 크리티컬 섹션 락 구현
        this.updateAll();
    }

    async getJsonbyUrl(url) {
        return new Promise((resolve, reject) => {
            const request = https.request(url, function(res) {
                let data = ``;

                res.on('data', function(chunk) { data += chunk.toString(); });
                res.on('end', function() {
                    if (res.statusCode === 200) {
                        console.log(`${url} OK`);
                        const body = JSON.parse(data);
                        resolve(body);
                        // 처리 함수
                    } else {
                        reject(`${url}에 대한 OK 에러 발생`)
                    }
                });
            });
            request.on('error', function(err) {
                reject(`${url}에 대한 request 에러 발생`);
            });
            request.setTimeout(50000, function() {
                reject(`${url} timeout`);
            });

            request.end();
        });
    }

    updateAll() {
        // 최근 킬보드 20개를 불러와 조건에 맞는 킬보드를 배열에 담습니다.
        // https://gameinfo.albiononline.com/api/gameinfo/battles?offset=${i}&limit=1&sort=recent
        for (var i = 0; i < this.updateAllCount; i++) {
            this.update(`https://gameinfo.albiononline.com/api/gameinfo/battles?offset=${i}&limit=1&sort=recent`);
        }
    }

    process_event(body) {
        let test = new Object();
        test.test2 = body['EventId'];

        return test;
    }

    async process_battle(json) { // 배틀 로그를 가공하는 작업
        return new Promise((resolve, reject) => {
            const battlelog = json[0];

            let battleItem = new Object();
            battleItem.battleId = battlelog['id']; // 배틀 아이디
            battleItem.totalKills = battlelog['totalKills']; // 총 킬 수
            battleItem.totalPlayers = Object.keys(battlelog['players']).length; // 유저 수
            battleItem.startTime = new Date(battlelog['startTime']); // 시작 시간
            battleItem.killevent = new Array(); // 킬 이벤트를 담을 배열

            for (let i = 0; i < battleItem.totalKills; i++) {
                // 총 킬 수 만큼의 이벤트 값을 얻는다
                try {
                    (async(arg) => {
                        const start = arg;
                        let body = await this.getJsonbyUrl(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battleItem.battleId}?offset=${start}&limit=1`);

                        let event = this.process_event(body);
                        battleItem.killevent.push(event);
                        resolve(battleItem);
                    })(i);
                } catch (e) {
                    reject(e);
                }
            }

            // console.log(battleItem);
        });
    }

    async update(url) {
        let complete = false;
        while (true) {
            // url에 접속하여 데이터를 얻는다.


            try {
                const body = await this.getJsonbyUrl(url);
                let battleItem = await this.process_battle(body);

                // lock
                this.mutex.use();
                this.arrTotal.push(battleItem);
                // unlock
                this.mutex.release();
                console.log(this.arrTotal.killevent);

                complete = true;
            } catch (e) {
                console.log(e);
            }

            if (complete === true) break;
        }
    }
}
async function auto_analysis() {
    // 1. 최신 킬보드 정보를 얻는다
    //https: //gameinfo.albiononline.com/api/gameinfo/battles?offset=${i}&limit=1&sort=recent

}

function testjson() {
    let arrTotal = new Array();
    let Item = new Object();
    Item.id = 1234567;
    Item.name = 'Wanthealcome';
    Item.arrVictim = new Array();
    for (var i = 0; i < 10; i++) {
        let Victim = new Object();
        Victim.name = `Hello ${i}`;
        Item.arrVictim.push(Victim);
        arrTotal.push(Item);
    }


    console.log(arrTotal);
    console.log(arrTotal[0].arrVictim);

}

function testAnalysis() {
    let a = new analysis();
    a.updateAll();
}

testAnalysis();