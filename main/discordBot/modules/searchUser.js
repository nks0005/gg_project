const axios = require('axios');
const { MessageEmbed } = require("discord.js");

class searchUser {
    constructor(Channel) {
        this.channel = Channel;
    }

    async update(userName) {
        let userEmbed;
        try {
            const ret = await axios.get(`http://localhost:3000/search/${userName}`);

            userEmbed = new MessageEmbed();
            if (ret.status == 201) {
                const wincount = `${ret.data['wincount']}`;
                const losecount = `${ret.data['losecount']}`;

                userEmbed.setColor('#0099ff')
                    .setTitle(`${userName}의 전적 검색 결과입니다.`)
                    .addField(`승리 : `, `${wincount}`, true)
                    .addField(`패배 : `, `${losecount}`, true);

                this.channel.send({ embeds: [userEmbed] });


            } else if (ret.status == 202) {
                console.log("통계 조사 중 202 에러");
                this.channel.send('오류');
            }
        } catch (err) {
            console.error(err);
        }
    }
}
exports.modules = searchUser;