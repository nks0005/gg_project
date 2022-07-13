const axios = require('axios');
const { MessageEmbed } = require("discord.js");
const jsonItems = require('./json/items.json');

class totallist {
    constructor(Client, Limit) {
        this.channel = Client;
        this.limit = Limit;
    }

    findItemKr(itemName) {
        itemName = 'T8_' + itemName;

        for (const item of jsonItems) {
            if (itemName == item['UniqueName']) {
                let ret = item['LocalizedNames']['KO-KR'];
                ret = ret.replace('장로의 ', '');

                return ret;
            }
        }
    }

    async update() {
        try {
            let totallogs = await axios.get(`http://localhost:3000/total/list/${this.limit}`);

            let totalEmbed = new MessageEmbed();

            totalEmbed.setColor('#0099ff')
                .setTitle(`2022-07-05 ~ 현재까지 조합 통계 입니다.`);



            for (const total of totallogs.data) {
                let { A, B, C, D, E, win, lose } = total;
                A = this.findItemKr(A);
                B = this.findItemKr(B);
                C = this.findItemKr(C);
                D = this.findItemKr(D);
                E = this.findItemKr(E);

                let winrate = parseInt((win / (win + lose)) * 100);

                let body = `⚔️${A} | ${B} | ${C} | ${D} | ${E}`;

                totalEmbed.addField(`승리 : ${win} | 패배 : ${lose} | 승률 : ${winrate}%`, body, false);
            }

            this.channel.send({ embeds: [totalEmbed] });

        } catch (err) {
            this.channel.send('오류');
            console.log(err);
        }
    }
}

exports.modules = totallist;