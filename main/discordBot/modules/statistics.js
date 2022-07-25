const axios = require('axios');
const { MessageEmbed } = require("discord.js");

const QuickChart = require('quickchart-js');

class statistics {
    constructor(Channel, Hour, Channel1010) {
        this.hour = Hour;
        this.channel = Channel;
        this.channel1010 = Channel1010;
    }

    async updateall1010() {
        try {
            const ret = await axios.get(`http://localhost:3000/statistics/ten/99999999999999`);

            if (ret.status == 201) {
                let hellgateEmbed = new MessageEmbed();

                hellgateEmbed.setColor('#0099ff')
                    .setTitle(`2022-07-23 ~ 현재까지 통계 입니다. UTC 기준입니다.`)

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

                this.channel1010.send({ embeds: [hellgateEmbed] });

                const chart = new QuickChart();
                chart.setConfig({
                    type: 'line',
                    data: {
                        labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        datasets: [{
                            label: '5v5',
                            data: [
                                arrTime[0], arrTime[1], arrTime[2], arrTime[3], arrTime[4], arrTime[5], arrTime[6], arrTime[7], arrTime[8],
                                arrTime[9], arrTime[10], arrTime[11], arrTime[12], arrTime[13], arrTime[14], arrTime[15], arrTime[16], arrTime[17],
                                arrTime[18], arrTime[19], arrTime[20], arrTime[21], arrTime[22], arrTime[23], arrTime[24]
                            ]
                        }]
                    },
                });
                const url = await chart.getShortUrl();

                this.channel1010.send(`그래프 ${url}`);

            } else if (ret.status == 202) {
                console.log("통계 조사 중 202 에러");
                this.channel1010.send('오류');
            }

        } catch (err) {
            this.channel.send('에러');
            console.error(err);
        }
    }

    async updateall() {
        try {
            const ret = await axios.get(`http://localhost:3000/statistics`);

            if (ret.status == 201) {
                let hellgateEmbed = new MessageEmbed();

                hellgateEmbed.setColor('#0099ff')
                    .setTitle(`2022-07-05 ~ 현재까지 통계 입니다. UTC 기준입니다.`)

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

                const chart = new QuickChart();
                chart.setConfig({
                    type: 'line',
                    data: {
                        labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        datasets: [{
                            label: '5v5',
                            data: [
                                arrTime[0], arrTime[1], arrTime[2], arrTime[3], arrTime[4], arrTime[5], arrTime[6], arrTime[7], arrTime[8],
                                arrTime[9], arrTime[10], arrTime[11], arrTime[12], arrTime[13], arrTime[14], arrTime[15], arrTime[16], arrTime[17],
                                arrTime[18], arrTime[19], arrTime[20], arrTime[21], arrTime[22], arrTime[23], arrTime[24]
                            ]
                        }]
                    },
                });
                const url = await chart.getShortUrl();

                this.channel.send(`그래프 ${url}`);

            } else if (ret.status == 202) {
                console.log("통계 조사 중 202 에러");
                this.channel.send('오류');
            }

        } catch (err) {
            this.channel.send('에러');
            console.error(err);
        }
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

                const chart = new QuickChart();
                chart.setConfig({
                    type: 'line',
                    data: {
                        labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        datasets: [{
                            label: '5v5',
                            data: [
                                arrTime[0], arrTime[1], arrTime[2], arrTime[3], arrTime[4], arrTime[5], arrTime[6], arrTime[7], arrTime[8],
                                arrTime[9], arrTime[10], arrTime[11], arrTime[12], arrTime[13], arrTime[14], arrTime[15], arrTime[16], arrTime[17],
                                arrTime[18], arrTime[19], arrTime[20], arrTime[21], arrTime[22], arrTime[23], arrTime[24]
                            ]
                        }]
                    },
                });
                const url = await chart.getShortUrl();

                this.channel.send(`그래프 ${url}`);

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