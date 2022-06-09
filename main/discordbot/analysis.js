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



    updateAll() {
        // 최근 킬보드 20개를 불러와 조건에 맞는 킬보드를 배열에 담습니다.
        // https://gameinfo.albiononline.com/api/gameinfo/battles?offset=${i}&limit=1&sort=recent
        for (var i = 0; i < this.updateAllCount; i++) {
            this.update(`https://gameinfo.albiononline.com/api/gameinfo/battles?offset=${i}&limit=1&sort=recent`);
        }
    }

    async update(url) {
        // url에 접속하여 데이터를 얻는다.


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

testjson();