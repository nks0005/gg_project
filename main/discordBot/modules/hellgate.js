const axios = require('axios');
const { guildId, hellgate55ChannelId } = require('../config/config.json');
const { MessageEmbed } = require("discord.js");

class hellgate {
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

    async sendDiscord(data) {
        let hellgateEmbed = new MessageEmbed();
        const { battleId, logTime } = data;

        var date = new Date(logTime).getTime();
        date += (18 * 60 * 60 * 1000);

        hellgateEmbed.setColor('#0099ff')
            .setTitle(`https://albionbattles.com/battles/${battleId}`)
            .setURL(`https://albionbattles.com/battles/${battleId}`)
            .setAuthor({ name: 'Find! 5v5 hellgate killboard', iconURL: 'https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg', url: `https://albionbattles.com/battles/${battleId}` })
            .setThumbnail('https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg')
            //.addField('Inline field title', 'Some value here', true)
            //.setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp(this.timestamp2datetime(new Date(date)))
            .setFooter({ text: '한국 시간 : ', iconURL: 'https://i.imgur.com/SR04reG.jpeg' });

        let highUser = false;
        let judgeBoots = false;
        for (const eventlog of data['eventlogs']) {
            let zeroIpCheck = false;
            let offsetSupport = 2;
            let arrMsg = [{}, ];
            for (const playerlog of eventlog['playerlogs']) {
                const { userName, killType, damage, heal, avgIp, shoes } = playerlog;
                let offset = 0;

                if (avgIp > 1320)
                    highUser = true;

                if (shoes.includes(`SHOES_PLATE_KEEPER`))
                    judgeBoots = true;

                if (killType == 0) {
                    arrMsg[killType] = `${userName}(${avgIp})`;
                } else if (killType == 1) {
                    if (avgIp == 0) zeroIpCheck = true;
                    arrMsg[killType] = `${userName}(${avgIp})`;
                } else if (killType == 2) {
                    offset = offsetSupport++;
                    arrMsg[offset] = `⚔️${userName}(${avgIp})🔥(${damage})❤️(${heal})\n`;
                }
            }
            let support = ``;
            for (var i = 2; i < offsetSupport; i++)
                support += arrMsg[i];
            if (support == ``) support = `?`;

            if (!zeroIpCheck)
                hellgateEmbed.addField(`${arrMsg[0]}🗡️${arrMsg[1]}`, support, false);
        }
        this.channel.send({ embeds: [hellgateEmbed] });

        if (judgeBoots)
            this.channel.send(`심판관 부츠 유저가 있습니다! <@&995137308732960778>`); // @Alarm
        else if (highUser)
            this.channel.send(`높은 기어 유저가 있습니다! <@&995137308732960778>`); // @Alarm
    }

    async reSend(battleId) {
        let ret;
        try {
            ret = await axios.get(`http://localhost:3000/hellgate/${battleId}`);
        } catch (err) {}
        if (ret.status != 201)
            this.reSend(battleId);
    }


    async update() {
        try {
            // 데이터를 받는다
            let ret = await axios.get(`http://localhost:3000/hellgate`);
            //console.log(ret.data[0]['eventlogs'])

            if (ret.data.length && ret.status == 201) {
                const data = ret.data[0];
                await this.sendDiscord(data);

                ret = await axios.get(`http://localhost:3000/hellgate/${data['battleId']}`);
                if (ret.status == 201) {
                    var newDate = new Date().toLocaleTimeString();
                    console.log(`${newDate} : ${ret.status}, ${ret.data}`);
                }
                if (ret.status == 501) {
                    await this.reSend(data['battleId']);
                }
            }
        } catch (err) {
            console.log(err);
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


exports.modules = hellgate;