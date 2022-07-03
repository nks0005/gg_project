const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { clientId, hellgate_guildId, BOT_TOKEN } = require('../../../config/discord_config.json');
const battlemodule = require('./update_killboard');
const hellgatecommand = require('./hellgate');
const mysql2 = require('mysql2');

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // Client 객체 생성

const cc = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function sendMsgINF(guildId, channelId) {
    const con = mysql2.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: 'my_bot'
    });

    while (true) {
        await cc(10000);
        //console.log(guildId, channelId);
        let [ret] = await con.promise().query(`SELECT * FROM hellgate55 WHERE sendCheck = 0`);

        console.log(ret.length);
        for (var i = 0; i < ret.length; i++) {
            const battleid = ret[i]['battleid'];
            await con.promise().query(`UPDATE hellgate55 SET sendCheck = 1 WHERE battleid = '${battleid}';`);

            let [ret2] = await con.promise().query(`SELECT endtime FROM battlelog WHERE battleid = '${battleid}';`);
            let time = new Date(ret2[0]['endtime']);
            time.setHours(time.getHours() + 9);
            const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`https://albionbattles.com/battles/${battleid}`)
                .setURL(`https://albionbattles.com/battles/${battleid}`)
                .setAuthor({ name: '5v5 헬게이트 누군가 돌고 있습니다!', iconURL: 'https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg', url: `https://albionbattles.com/battles/${battleid}` })
                .setThumbnail('https://assets.albiononline.com/uploads/media/default/media/89b5676c825db5b0c9ff14a13d8149cb2477ab4d.jpeg')
                //.addField('Inline field title', 'Some value here', true)
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp(time)
                .setFooter({ text: 'WantHealCome', iconURL: 'https://i.imgur.com/SR04reG.jpeg' });

            client.guilds.cache.get(guildId).channels.cache.get(channelId).send({ embeds: [exampleEmbed] });
        }
    }
}
/*

        }
            const battleid = ret[i]['battleid'];
            await con.promise().query(`UPDATE hellgate55 SET sendCheck = 1 WHERE battleid = '${battleid}';`);

            let [battlelogs] = await con.promise().query(`SELECT * FROM battlelog WHERE battleid = '${battleid}';`);
            console.log(battlelogs.length);


            for (var i = 0; i < battlelogs; i++) {
                const battlelog = battlelogs[i];

                let [eventlogs] = await con.promise().query(`SELECT * FROM killevent WHERE battleid = '${battlelog['battleid']}';`);
                let arrPlayer = new Array();

                let item = new Object();
                item.killcount = eventlogs.length;
                item.arrEvent = new Array();

                for (var j = 0; j < eventlogs.length; j++) {
                    const eventlog = eventlogs[j];

                    let [players] = await con.promise().query(`SELECT * FROM player WHERE eventid = '${eventlog['eventid']}';`);
                    console.log(`players count : ${players.length}`);
                    let itemEvent = new Object();
                    const time = new Date(eventlog['starttime']).toISOString().slice(0, 19).replace('T', ' ');
                    itemEvent.time = time;
                    itemEvent.arrPlayers = new Array();

                    for (var k = 0; k < players.length; k++) {
                        const player = players[k];
                        let itemPlayer = new Object();
                        itemPlayer.name = player['playername'];
                        itemPlayer.avgip = player['avgip'];
                        console.log(player['deathfame']);

                        itemPlayer.eq = new Array();

                        let [equiments] = await con.promise().query(`SELECT * FROM equiment WHERE eqid = '${player['eqid']}';`);
                        console.log(`equiment count : ${equiments.length}`);
                        for (var z = 0; z < equiments.length; z++) {
                            const eqi = equiments[z];
                            itemEq = new Object();
                            const eqcheck = (eq) => {
                                if (eq === '0') return undefined;
                                return eq;
                            };

                            itemEq.mainhand = eqcheck(eqi['mainhand']);
                            itemEq.offhand = eqcheck(eqi['offhand']);
                            itemEq.head = eqcheck(eqi['head']);
                            itemEq.armor = eqcheck(eqi['armor']);
                            itemEq.shoes = eqcheck(eqi['shoes']);
                            itemEq.cape = eqcheck(eqi['cape']);
                            itemEq.potion = eqcheck(eqi['potion']);
                            itemEq.food = eqcheck(eqi['food']);

                            itemPlayer.eq.push(itemEq);
                        }

                        itemEvent.arrPlayers.push(itemPlayer);
                    }
                    arrEvent.push(itemEvent);
                }

                console.log(`arrevent.length : ${arrEvent.length}`);
                for (var l = 0; l < arrEvent.length; l++) {
                    const event = arrEvent[l];
                    console.log(event);
                }


                
            }
        }

}
}
}
*/
// discord 봇이 실행될 때 딱 한번 실행할 코드를 적는 부분
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const battle = new battlemodule.hellgatemodule();
    battle.updateINF();


    // .setTimestamp('2015-11-1 05:02:12')
    //  .setFooter({ text: 'WantHealCome', iconURL: 'https://i.imgur.com/SR04reG.jpeg' });



    sendMsgINF("748345742158200832", "984771898103713802");


});

/*
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'hellgate') {
        const hellgate = new hellgatecommand.hellgatemodule();
        await interaction.reply('처리중입니다.');
        let msg = await hellgate.check5v5hellgate1hour(interaction);
        if (msg === ``) {
            msg = `1시간 내 아무도 싸우지않았습니다.😥😥😥`;

        }
        await interaction.editReply(msg);
        //for (var i = 0; i < msg.length; i++) {
        //    await interaction.reply(msg[i].msg);
        //}
    }
});
*/

client.login(BOT_TOKEN);