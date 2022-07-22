const axios = require('axios');

class monitor {
    constructor(battleMax, timeCycle) {
        this.battleMax = battleMax;
        this.timeCycle = timeCycle;
    }

    async sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    array2count(array) {
        return parseInt(Object.keys(array).length);
    }

    timestamp2datetime(timestamp) {
        return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
    }

    equip2Type(Equip) {
        if (Equip == null) return Equip;
        return Equip['Type'];
    }

    async check55Hellgate(battlelogs) {
        const { id, totalKills, players } = battlelogs;
        const totalPlayers = this.array2count(players);

        if (totalPlayers == 10 && totalKills >= 4 && totalKills < 10) {
            let eventlogs = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${id}?offset=0&limit=${totalKills}`);

            var healer = 0;
            var party = 0;
            var item = 0;

            for (const eventlog of eventlogs.data) {
                // 파티 확인
                if (this.array2count(eventlog['GroupMembers']) === 5) party++;

                // 힐 딜 확인
                for (const support of eventlog['Participants']) {
                    if (support['SupportHealingDone'] > 0) healer++;
                    if (support['AverageItemPower'] != 0 && support['AverageItemPower'] < 1100 || support['AverageItemPower'] > 1430) item++;
                }
            }
            //console.log(`${id} = ${party} : ${totalKills} | ${healer} | ${item}`);
            if (party >= totalKills && healer > 0 && item == 0) {
                //console.log(`${id} = ${party} : ${totalKills} | ${healer} | ${item}`);
                return true;
            }
        }
        return false;

    }

    async check1010Hellgate(battlelogs) {
        const { id, totalKills, players } = battlelogs;
        const totalPlayers = this.array2count(players);

        if (totalPlayers == 20 && totalKills >= 10 && totalKills < 20) {
            let eventlogs = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${id}?offset=0&limit=${totalKills}`);

            var healer = 0;
            var party = 0;
            var item = 0;

            for (const eventlog of eventlogs.data) {
                // 파티 확인
                if (this.array2count(eventlog['GroupMembers']) === 10) party++;

                // 힐 딜 확인
                for (const support of eventlog['Participants']) {
                    if (support['SupportHealingDone'] > 0) healer++;
                    if (support['AverageItemPower'] != 0 && support['AverageItemPower'] < 1100 || support['AverageItemPower'] > 1430) item++;
                }
            }
            //console.log(`${id} = ${party} : ${totalKills} | ${healer} | ${item}`);
            if (party >= totalKills && healer > 0 && item == 0) {
                //console.log(`${id} = ${party} : ${totalKills} | ${healer} | ${item}`);
                return true;
            }
        }
        return false;
    }

    async update() {
        let result;
        try {
            result = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${this.battleMax}&sort=recent`);
            if (result.status == 200 && result.data != null) {
                for (const battlelog of result.data) {
                    //this.cursor = battlelog['id'];
                    if (await this.check55Hellgate(battlelog)) {
                        await axios.get(`http://localhost:3000/${battlelog['id']}`).then((res) => {
                            if (res.status == 201) {
                                var newDate = new Date().toLocaleTimeString();
                                console.log(`monitor ${newDate} : ${res.status}, ${res.data}`);
                            }
                        });
                    } else if (await this.check1010Hellgate(battlelog)) {
                        await axios.get(`http://localhost:3000/ten/${battlelog['id']}`).then((res) => {
                            if (res.status == 201) {
                                var newDate = new Date().toLocaleTimeString();
                                console.log(`monitor ${newDate} : ${res.status}, ${res.data}`);
                            }
                        });
                    } else {
                        //console.log(result.status);
                    }
                }
            }

            result = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/battles?offset=${this.battleMax}&limit=${this.battleMax}&sort=recent`);
            if (result.status == 200 && result.data != null) {
                for (const battlelog of result.data) {
                    //this.cursor = battlelog['id'];
                    if (await this.check55Hellgate(battlelog)) {
                        await axios.get(`http://localhost:3000/${battlelog['id']}`).then((res) => {
                            if (res.status == 201) {
                                var newDate = new Date().toLocaleTimeString();
                                console.log(`monitor ${newDate} : ${res.status}, ${res.data}`);
                            }
                        });
                    } else if (await this.check1010Hellgate(battlelog)) {
                        await axios.get(`http://localhost:3000/ten/${battlelog['id']}`).then((res) => {
                            if (res.status == 201) {
                                var newDate = new Date().toLocaleTimeString();
                                console.log(`monitor ${newDate} : ${res.status}, ${res.data}`);
                            }
                        });
                    } else {
                        //console.log(result.status);
                    }
                }
            }
            //const url = `http://localhost/${battleId}`;
            // result = await axios.get(url);
        } catch (err) {
            console.error(err);
        }
    }


    async updateCycle() {

        while (true) {
            try {
                //var newDate = new Date().toLocaleTimeString();
                //console.time(newDate);
                await this.update();

                await this.sleep(this.timeCycle);
                //console.timeEnd(newDate);
            } catch (err) {
                console.error(err);
            }
        }
    }
}
exports.modules = monitor;