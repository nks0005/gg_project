const Discord = require('discord.js');
const { clientId, hellgate_guildId, BOT_TOKEN } = require('../../../config/discord_config.json');
const battlemodule = require('./update_killboard');
const hellgatecommand = require('./hellgate');

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // Client 객체 생성

const cc = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

// discord 봇이 실행될 때 딱 한번 실행할 코드를 적는 부분
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const battle = new battlemodule.hellgatemodule();
    battle.updateINF();

});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'hellgate') {
        const hellgate = new hellgatecommand.hellgatemodule();
        let msg = await hellgate.check5v5hellgate1hour();
        if (msg === ``) {
            msg = `1시간 내 아무도 싸우지않았습니다.😥😥😥`;
        }

        await interaction.reply(msg);
    }
});

client.login(BOT_TOKEN);