const axios = require('axios');
const { guildId, hellgate55ChannelId } = require('../config/config.json');
const { MessageEmbed } = require("discord.js");

class totalstat {
    constructor(Client, timeCycle) {
        this.channel = Client;
        this.timeCycle = timeCycle;
    }

    async sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    timestamp2datetime(timestamp) {
        return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
    }

    /*
    누가 승리했는지 확인해야 함.
    첫 이벤트 킬에서 어시스트들이 A 파티
    그 외 이름들은 B 파티

    */

    filterMainHand(mainHand) {
        let filterMainHand = ``;
        let start = mainHand.indexOf('_') + 1;
        let end = mainHand.lastIndexOf('@');

        if (end == -1)
            filterMainHand = mainHand.substring(start);
        else
            filterMainHand = mainHand.substring(start, end);

        return filterMainHand;
    }

    compareParty(partyA, userName) {
        let Check = false;
        for (const party of partyA) {
            if (party.Name == userName) {
                Check = true;
            }
        }
        return Check;
    }


    async sendTotal(data) {
        const { battleId, totalKills } = data;

        try {
            let ret = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battleId}?offset=0&limit=${totalKills}`);


            if (ret.status == 200 && ret.data.length > 0) {
                const eventlogs = ret.data;

                let partyA = [],
                    partyB = [];
                let loseA = 0,
                    loseB = 0;

                for (const eventlog of eventlogs) {
                    const { GroupMembers, Victim } = eventlog;
                    let tmp = [];

                    if (GroupMembers != undefined) {
                        for (const member of GroupMembers) {
                            const { Name, AverageItemPower } = member;
                            const Type = member['Equipment']['MainHand'];

                            if (Type != null) {
                                let filteredMainHand = this.filterMainHand(Type['Type']);

                                if (tmp.length < 5) { // A 팀 부터 채워야 함
                                    tmp.push({ Name, filteredMainHand });

                                } else { // B 팀을 채워야 함

                                    // 1. A팀인지 여부 확인
                                    if (!this.compareParty(partyA, Name)) { // A팀이 아니라면 B팀
                                        if (!this.compareParty(partyB, Name)) // 이미 B팀에 존재하는지 확인
                                            partyB.push({ Name, filteredMainHand });
                                    }
                                }
                            }
                        }
                        if (tmp.length != 5) continue; // A팀이 제대로 만들어지지 않음
                        partyA = tmp;


                        if (Victim != undefined) {
                            if (partyA.length == 5) { // A팀이 결정되었다면 죽은자는 B팀일 가능성이 높다.
                                const { Name, AverageItemPower } = Victim;
                                const Type = Victim['Equipment']['MainHand'];


                                if (AverageItemPower > 0) {
                                    if (Type != null) {
                                        let filteredMainHand = this.filterMainHand(Type['Type']);

                                        // 1. A팀인지 여부 확인
                                        if (!this.compareParty(partyA, Name)) { // A팀이 아니라면 B팀
                                            if (!this.compareParty(partyB, Name)) { // 이미 B팀에 존재하는지 확인
                                                loseB++;
                                                partyB.push({ Name, filteredMainHand });
                                            } else {
                                                loseA++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                let sort_a_party = [];
                let sort_b_party = [];

                for (const { userName, filteredMainHand }
                    of partyA) {
                    sort_a_party.push(filteredMainHand);
                }

                for (const { userName, filteredMainHand }
                    of partyB) {
                    sort_b_party.push(filteredMainHand);
                }


                sort_a_party.sort();
                sort_b_party.sort();


                if (loseA > loseB) { // A가 짐 
                    if (sort_a_party.length == 5)
                        await axios.post('http://localhost:3000/total/win/', sort_b_party);
                    if (sort_b_party.length == 5)
                        await axios.post('http://localhost:3000/total/lose/', sort_a_party);
                } else { // B가 짐
                    if (sort_a_party.length == 5)
                        await axios.post('http://localhost:3000/total/win/', sort_a_party);
                    if (sort_b_party.length == 5)
                        await axios.post('http://localhost:3000/total/lose/', sort_b_party);
                }
            }


        } catch (err) {
            console.log(err);
        }


        return;
    }
    async reSend(battleId) {
        let ret;
        try {
            ret = await axios.get(`http://localhost:3000/total/${battleId}`);
        } catch (err) {}
        if (ret.status != 201)
            this.reSend(battleId);
    }

    async update() {
        try {
            // 데이터를 받는다
            let ret = await axios.get(`http://localhost:3000/total`);

            if (ret.data.length && ret.status == 201) {
                const data = ret.data[0];

                await this.sendTotal(data);

                ret = await axios.get(`http://localhost:3000/total/${data['battleId']}`);
                if (ret.status == 201) {
                    var newDate = new Date().toLocaleTimeString();
                    console.log(`total ${data['battleId']} : ${newDate} : ${ret.status}, ${ret.data}`);
                }
                if (ret.status == 501) {
                    await this.reSend(data['battleId']);
                }
            }
        } catch (err) {

        }
    }

    async updateCycle() {
        while (true) {
            try {
                await this.update();

                await this.sleep(this.timeCycle);
            } catch (err) {
                console.error(err);
            }
        }
    }
}

exports.modules = totalstat;