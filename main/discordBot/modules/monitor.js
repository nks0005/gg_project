const axios = require('axios');
const { default: Undici } = require('undici');

class monitor {
    constructor(battleMax, timeCycle) {
        this.battleMax = battleMax;
        this.timeCycle = timeCycle;
        this.newCursor = '';
        this.oldCursor = '';
    }

    async sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async check55Hellgate(battlelog) {
        // 10명 
    }

    async check1010Hellgate(battlelog) {

    }

    async update() {
        let result;
        try {
            result = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${this.battleMax}&sort=recent`);
            if (result.status == 200 && result.data != null) {
                for (const battlelog of result.data) {
                    //this.cursor = battlelog['id'];
                    axios.get(`http://localhost:3000/${battlelog['id']}`).then((res) => {
                        if (res.status == 201)
                            console.log(res.status + ", " + res.data);

                    });
                }
            } else {
                console.log(result.status);
            }

            //const url = `http://localhost/${battleId}`;
            // result = await axios.get(url);
        } catch (err) {
            console.error(err);
        }
    }

    async updateCycle() {
        while (true) {
            console.time('start');
            await this.update();

            await this.sleep(this.timeCycle);
            console.timeEnd('start');
        }
    }
}

const test = new monitor(50, 5000);
test.updateCycle();

exports.module = monitor;