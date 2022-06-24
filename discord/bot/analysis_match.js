const { MessageEmbed, Client, Message } = require("discord.js"); // discord 봇 모듈
const { clientId, guildId, botToken } = require('./config/config.json'); // 설정 값
const updatekillboard = require('./module/updateKillboard');
const hellgate = require('./module/hellgate');
const crawler = require('./module/crawler');
const database = require('./module/database');

const { DB } = require('./config/config.json');



const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // 사용 목적 고지


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'match') {
        await interaction.reply('처리중...');
        const battleid = interaction.options.getString('battle_id');
        console.log(battleid);

        const con = new database.database(DB).getCon();
        let param = [battleid];
        const [hellgate55] = await con.query(`SELECT battleid FROM hellgate55 WHERE battleid = ?;`, param);
        let msg = ``;
        for (const hellgate of hellgate55) {
            const [eventlogs] = await con.query(`SELECT eventid FROM eventlog WHERE battleid = ${hellgate['battleid']};`);
            for (const eventlog of eventlogs) {
                const [playerlogs] = await con.query(`SELECT * FROM playerlog WHERE eventid = ${eventlog['eventid']}`);
                msg = ``;
                for (const playerlog of playerlogs) {
                    msg += `${playerlog['username']} : ${(playerlog['mainhand'])} | ${playerlog['head']} | ${playerlog['armor']} | ${playerlog['shoes']} | ${playerlog['cape']} \n`;
                }
                await interaction.followUp(msg);
            }
        }

        if (msg === ``) {
            await interaction.editReply(`battle id 값을 정확히 입력하세요.`);
        } else {

        }
    }
});


client.on('ready', () => {
    console.log(`Logged ${client.user.tag}`);

});

client.login(botToken);