const { MessageEmbed, Client } = require("discord.js"); // discord 봇 모듈
const { clientId, guildId, botToken } = require('./config/config.json'); // 설정 값
const updatekillboard = require('./module/updateKillboard');
const hellgate = require('./module/hellgate');

const database = require('./module/database');
const { DB } = require('./config/config.json');



const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // 사용 목적 고지


async function sendDiscordMsg(guildId, channelId) {
    // check
    try {
        const con = new database.database(DB, 10).getCon();

        let [ret] = await con.query(`SELECT * FROM hellgate55 WHERE checkvalue = 0;`);
        if (ret.length > 0) {
            for (const hellgate55 of ret) {
                await con.query(`UPDATE hellgate55 SET sendCheck = 1 WHERE battleid = '${hellgate55['battleid']}';`);

                let [battelogs] = await con.query(`SELECT * FROM battlelog WHERE battleid = '${hellgate55['battleid']}'`);

                let time = new Date(battelogs[0]['endtime']);
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
    } catch (err) {
        console.trace();
        console.error(`${err} 디스코드 메시지를 보내는 도중 에러가 발생하였습니다.`);
    }

}


client.on('ready', () => {
    console.log(`Logged ${client.user.tag}`);

    (async() => {
        const update = new updatekillboard.killboard();
        const checkhellgate = new hellgate.hellgate();
        while (true) {
            await update.start();
            await checkhellgate.check55hellgate();
            await sendDiscordMsg("748345742158200832", "984771898103713802")
            await (async(ms) => {
                return new Promise(resolve => setTimeout(resolve, ms));
            })(1000);
        }
    })();
});

client.login(botToken);