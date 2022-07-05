const { MessageEmbed, Client, Message } = require("discord.js"); // discord 봇 모듈
const { guildId, hellgate55ChannelId, botToken } = require('./config/config.json'); // 설정 값


const Monitor = require('./modules/monitor');





const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // 사용 목적 고지




client.on('ready', () => {
    console.log(`Logged ${client.user.tag}`);

    const monitor = new Monitor.modules(50, 5000);
    monitor.updateCycle();





    client.guilds.cache.get(guildId).channels.cache.get(hellgate55ChannelId).send();

});

client.login(botToken);



(async() => {
    const update = new updatekillboard.killboard();
    const checkhellgate = new hellgate.hellgate();
    while (true) {
        await update.start();

        await checkhellgate.check55hellgate();
        await checkhellgate.check1010hellgate();
        //await send55hellgatediscord("748345742158200832", "987632025630564402");
        //await send1010hellgatediscord("748345742158200832", "987611687198789632");

        await (async(ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        })(1000);
    }
});

async function send1010hellgatediscord(guildId, channelId) {
    try {
        const con = new database.database(DB).getCon();
        let exampleEmbed = new MessageEmbed();

        let [ret] = await con.query(`SELECT * FROM hellgate1010 WHERE checkvalue = 0;`);
        for (const hellgate1010 of ret) {
            exampleEmbed = new MessageEmbed();
            const battleid = hellgate1010['battleid'];
            await con.query(`UPDATE hellgate1010 SET checkvalue = 1 WHERE battleid = '${battleid}'`);

            let [battelogs] = await con.query(`SELECT * FROM battlelog WHERE battleid = '${battleid}'`);

            let time = new Date(battelogs[0]['endtime']);
            //time.setHours(time.getHours() + 9);


            exampleEmbed.setColor('#0099ff')
                .setTitle(`https://albionbattles.com/battles/${battleid}`)
                .setURL(`https://albionbattles.com/battles/${battleid}`)
                .setAuthor({ name: 'Find! 10v10 hellgate killboard', iconURL: 'https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg', url: `https://albionbattles.com/battles/${battleid}` })
                .setThumbnail('https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg')
                //.addField('Inline field title', 'Some value here', true)
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp(time)
                .setFooter({ text: 'UTC time : ', iconURL: 'https://i.imgur.com/SR04reG.jpeg' });


            // 플레이어 정보들을 넣으면 된다. 배틀 ID로 검색 이벤트 ID들을 찾고 이벤트 ID로 플레이어들을 검색한다.
            let [eventlogs] = await con.query(`SELECT * FROM eventlog WHERE battleid = '${battleid}'`);
            console.log(eventlogs.length);
            for (const eventlog of eventlogs) {
                const eventid = eventlog['eventid'];
                // 플레이어 정보들을 얻는다
                let [killerlogs] = await con.query(`SELECT * FROM playerlog WHERE eventid = '${eventid}' AND killtype = '0'`); // 막타
                //exampleEmbed.addField('막타', `${killerlogs[0]['username']} | ip : ${killerlogs[0]['avgip']}`, false);
                if (parseInt(killerlogs[0]['avgip']) === 0) continue;

                let [victimlogs] = await con.query(`SELECT * FROM playerlog WHERE eventid = '${eventid}' AND killtype = '1'`); // 사망자
                //exampleEmbed.addField('죽은자', `${victimlogs[0]['username']} | ip : ${victimlogs[0]['avgip']}`, false);
                if (parseInt(victimlogs[0]['avgip']) === 0) continue;

                let [partlogs] = await con.query(`SELECT * FROM playerlog WHERE eventid = '${eventid}' AND killtype = '2'`);
                //console.log(partlogs.length);
                //console.log(partlogs);
                let partmsg = ``;
                for (const partlog of partlogs) {
                    partmsg += `⚔️ ${partlog['username']}(${partlog['avgip']})       🔥(${partlog['damage']})        ❤️(${partlog['heal']})\n`;
                    //partmsg += `${partlog['mainhand']} | ${partlog['offhand']} | ${partlog['head']} | ${partlog['armor']} | ${partlog['shoes']} | ${partlog['cape']} | ${partlog['potion']} | ${partlog['food']}\n`;

                }

                exampleEmbed.addField(`${killerlogs[0]['username']}(${killerlogs[0]['avgip']})🗡️${victimlogs[0]['username']}(${victimlogs[0]['avgip']})`, partmsg, false);
            }



            client.guilds.cache.get(guildId).channels.cache.get(channelId).send({ embeds: [exampleEmbed] });
        }


    } catch (err) {
        console.trace();
        console.error(`${err} 디스코드 메시지를 보내는 도중 에러가 발생하였습니다.`);
    }
}
async function send55hellgatediscord(guildId, channelId) {
    // check
    try {
        const con = new database.database(DB).getCon();
        let exampleEmbed = new MessageEmbed();

        let [ret] = await con.query(`SELECT * FROM hellgate55 WHERE checkvalue = 0;`);
        if (ret.length > 0) {
            for (const hellgate55 of ret) {
                exampleEmbed = new MessageEmbed();
                const battleid = hellgate55['battleid'];
                await con.query(`UPDATE hellgate55 SET checkvalue = 1 WHERE battleid = '${battleid}';`);

                let [battelogs] = await con.query(`SELECT * FROM battlelog WHERE battleid = '${battleid}'`);

                let time = new Date(battelogs[0]['endtime']);
                //time.setHours(time.getHours() + 9);


                exampleEmbed.setColor('#0099ff')
                    .setTitle(`https://albionbattles.com/battles/${battleid}`)
                    .setURL(`https://albionbattles.com/battles/${battleid}`)
                    .setAuthor({ name: 'Find! 5v5 hellgate killboard', iconURL: 'https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg', url: `https://albionbattles.com/battles/${battleid}` })
                    .setThumbnail('https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg')
                    //.addField('Inline field title', 'Some value here', true)
                    //.setImage('https://i.imgur.com/AfFp7pu.png')
                    .setTimestamp(time)
                    .setFooter({ text: 'UTC time : ', iconURL: 'https://i.imgur.com/SR04reG.jpeg' });


                // 플레이어 정보들을 넣으면 된다. 배틀 ID로 검색 이벤트 ID들을 찾고 이벤트 ID로 플레이어들을 검색한다.
                let [eventlogs] = await con.query(`SELECT * FROM eventlog WHERE battleid = '${battleid}'`);
                console.log(eventlogs.length);
                for (const eventlog of eventlogs) {
                    const eventid = eventlog['eventid'];
                    // 플레이어 정보들을 얻는다
                    let [killerlogs] = await con.query(`SELECT * FROM playerlog WHERE eventid = '${eventid}' AND killtype = '0'`); // 막타
                    //exampleEmbed.addField('막타', `${killerlogs[0]['username']} | ip : ${killerlogs[0]['avgip']}`, false);
                    if (parseInt(killerlogs[0]['avgip']) === 0) continue;

                    let [victimlogs] = await con.query(`SELECT * FROM playerlog WHERE eventid = '${eventid}' AND killtype = '1'`); // 사망자
                    //exampleEmbed.addField('죽은자', `${victimlogs[0]['username']} | ip : ${victimlogs[0]['avgip']}`, false);
                    if (parseInt(victimlogs[0]['avgip']) === 0) continue;

                    let [partlogs] = await con.query(`SELECT * FROM playerlog WHERE eventid = '${eventid}' AND killtype = '2'`);
                    //console.log(partlogs.length);
                    //console.log(partlogs);
                    let partmsg = ``;
                    for (const partlog of partlogs) {
                        partmsg += `⚔️ ${partlog['username']}(${partlog['avgip']})       🔥(${partlog['damage']})        ❤️(${partlog['heal']})\n${partlog['mainhand']}`;
                        //partmsg += `${partlog['mainhand']} | ${partlog['offhand']} | ${partlog['head']} | ${partlog['armor']} | ${partlog['shoes']} | ${partlog['cape']} | ${partlog['potion']} | ${partlog['food']}\n`;

                    }

                    exampleEmbed.addField(`${killerlogs[0]['username']}(${killerlogs[0]['avgip']})🗡️${victimlogs[0]['username']}(${victimlogs[0]['avgip']})`, partmsg, false);
                }



                client.guilds.cache.get(guildId).channels.cache.get(channelId).send({ embeds: [exampleEmbed] });
            }
        }
    } catch (err) {
        console.trace();
        console.error(`${err} 디스코드 메시지를 보내는 도중 에러가 발생하였습니다.`);
    }

}