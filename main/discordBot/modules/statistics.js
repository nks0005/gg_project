const axios = require('axios');
const { MessageEmbed } = require("discord.js");

class statistics {
    constructor(Channel, Hour) {
        this.hour = Hour;
        this.channel = Channel;
    }

    async update() {
        try {
            const ret = await axios.get(`http://localhost:3000/statistics/${this.hour}`);

            if (ret.status == 201) {
                let hellgateEmbed = new MessageEmbed();

                hellgateEmbed.setColor('#0099ff')
                    .setTitle(`${this.hour} 시간 내 통계 입니다. UTC 기준입니다.`)

                .addField(`총판수 : `, `${ret.data.length}`, false);

                //
                let arrTime = new Array(24).fill(0);
                for (const playerlog of ret.data) {
                    const hour = parseInt(new Date(playerlog['createdAt']).getHours());
                    arrTime[hour] += 1;
                }

                for (var i = 0; i < arrTime.length; i++) {
                    hellgateEmbed.addField(`${i}시 : `, `${arrTime[i]} 판이 진행되었습니다.`, true);
                }

                this.channel.send({ embeds: [hellgateEmbed] });
            } else if (ret.status == 202) {
                console.log("통계 조사 중 202 에러");
                this.channel.send('오류');
            }
        } catch (err) {
            this.channel.send('에러');
            console.error(err);
        }
    }
}
exports.modules = statistics;