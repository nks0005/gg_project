const { Client } = require("discord.js"); // discord 봇 모듈
const { guildId, hellgate55ChannelId, statisticsChannelId, botToken } = require('./config/config.json'); // 설정 값


const Monitor = require('./modules/monitor');
const Hellgate = require('./modules/hellgate');
const Statistics = require('./modules/statistics');





const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // 사용 목적 고지

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


client.on('ready', () => {
    console.log(`Logged ${client.user.tag}`);


    const monitor = new Monitor.modules(50, 5000);
    monitor.updateCycle();

    const hellgate = new Hellgate.modules(client.guilds.cache.get(guildId).channels.cache.get(hellgate55ChannelId), 5000);
    hellgate.updateCycle();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const statistics = new Statistics.modules(client.guilds.cache.get(guildId).channels.cache.get(statisticsChannelId), 10);

    if (commandName === 'search') {
        await interaction.reply('검색 중...');
        await statistics.update();
    }
});

client.login(botToken);