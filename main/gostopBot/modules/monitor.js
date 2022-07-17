const axios = require('axios');
const Mutex = require('./Mutex').modules;
const { MessageEmbed } = require("discord.js");
const { Battlelogs, sequelize, Sequelize: { Op } } = require('../models');

class monitor {

    constructor(BattleMax, TimeCycle, Channel) {
        this.battleMax = BattleMax;
        this.timeCycle = TimeCycle;
        this.channel = Channel;

        this.mutex = new Mutex();
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


    async checkGostopEvent(id) {
        let gostopCount = 0;
        const gostopName = "GOSTOP";

        try {
            let eventlogs = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${id}?offset=0&limit=50`);

            for (const eventlog of eventlogs.data) {
                const { Killer, Victim, GroupMembers } = eventlog;

                if (Killer['GuildName'] == gostopName || Victim['GuildName'] == gostopName) gostopCount++;

                for (const group of GroupMembers) {
                    const { GuildName } = group;

                    if (GuildName == gostopName)
                        gostopCount++;
                }
            }
        } catch (err) {

        }

        return gostopCount;
    }

    async checkGostopBattle(battlelogs) {
        const { id, totalKills, players } = battlelogs;
        const totalPlayers = this.array2count(players);

        let gostopCount = 0;

        if (totalPlayers > 0) { // 총 인원 수
            if (totalKills > 51) {
                for (var i = 0; i < (totalKills / 50); i++) {
                    gostopCount += parseInt(await this.checkGostopEvent(id));
                }
            } else {
                gostopCount += parseInt(await this.checkGostopEvent(id));
            }

        }

        //console.log(gostopCount);
        return gostopCount;
    }

    async checkDB(id) {
        let check = false;
        try {
            this.mutex.acquire();

            const ret = await Battlelogs.findAll({
                where: { battleId: id }
            });

            if (ret.length) { // 존재
                check = true;
            } else { // 존재하지 않음
                await Battlelogs.create({
                    battleId: id,
                });
                check = false;
            }



        } catch (err) {
            this.mutex.release();
            throw `DB 확인 중 에러`;
        } finally {
            this.mutex.release();
            return check;
        }

    }

    async print(id, endTime) {
        let gostopEmbed = new MessageEmbed();

        gostopEmbed.setColor('#0099ff')
            .setTitle(`https://albionbattles.com/battles/${id}`)
            .setURL(`https://albionbattles.com/battles/${id}`)
            .setAuthor({ name: `[${new Date(endTime).toISOString().replace('T', ' ').substring(0, 19)}] GOSTOP 킬보드`, iconURL: 'https://play-lh.googleusercontent.com/fmfjgjcyz7cMYERzHWlChuWgN2d3iv875bd1SLw1q-L_dSYXOZ2BIUBd4gEymAKx2uk', url: `https://albionbattles.com/battles/${id}` })
        await this.channel.send({ embeds: [gostopEmbed] });
    }

    async updateBattelog(Battlelog) {
        const battlelog = Battlelog;
        const { id, endTime } = battlelog;

        if (await this.checkGostopBattle(battlelog) > 0) {

            if (!await this.checkDB(id)) {
                await this.print(id, endTime);
            }
        }

    }

    async update() {
        let result;
        try {
            result = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${this.battleMax}&sort=recent`);
            if (result.status == 200 && result.data != null) {
                for (const battlelog of result.data) {
                    this.updateBattelog(battlelog);
                }

            } else {
                console.log(result.status);
            }

        } catch (err) {
            console.error(err);
        }
    }

    async updateCycle() {
        while (true) {
            try {
                console.time('update');
                await this.update();
                await this.sleep(this.timeCycle);
                console.timeEnd('update');
            } catch (err) {
                console.error(err);
            }
        }
    }
}

exports.modules = monitor;