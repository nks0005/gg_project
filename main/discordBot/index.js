const { Client } = require("discord.js"); // discord 봇 모듈
const { guildId, hellgate55ChannelId, hellgate1010ChannelId, statistics1010ChannelId, statisticsChannelId, usersearchChannelId, botToken } = require('./config/config.json'); // 설정 값


const Monitor = require('./modules/monitor');
const Hellgate = require('./modules/hellgate');
const Statistics = require('./modules/statistics');
const SearchUser = require('./modules/searchUser');
const TotalStat = require('./modules/totalstat');
const TotalList = require('./modules/totallist');
const Hellgate1010 = require('./modules/hellgateTen');



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

    const totalstat = new TotalStat.modules(client.guilds.cache.get(guildId).channels.cache.get(hellgate55ChannelId), 5000);
    totalstat.updateCycle();

    const monitor = new Monitor.modules(50, 5000);
    monitor.updateCycle();

    const hellgate = new Hellgate.modules(client.guilds.cache.get(guildId).channels.cache.get(hellgate55ChannelId), 5000);
    hellgate.updateCycle();

    const hellgate1010 = new Hellgate1010.modules(client.guilds.cache.get(guildId).channels.cache.get(hellgate1010ChannelId), 5000);
    hellgate1010.updateCycle();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const statistics = new Statistics.modules(client.guilds.cache.get(guildId).channels.cache.get(statisticsChannelId), 24, client.guilds.cache.get(guildId).channels.cache.get(statistics1010ChannelId));
    const searchUser = new SearchUser.modules(client.guilds.cache.get(guildId).channels.cache.get(usersearchChannelId));
    const totalList = new TotalList.modules(client.guilds.cache.get(guildId).channels.cache.get(statisticsChannelId), 20);

    if (commandName === 'search') {
        await interaction.reply('검색 중...');
        await statistics.update();
    } else if (commandName === 'searchall55') {
        await interaction.reply('검색 중...');
        await statistics.updateall();
    } else if (commandName === 'searchall1010') {
        await interaction.reply('검색 중...');
        await statistics.updateall1010();
    } else if (commandName === 'user55') {
        const userName = interaction.options.getString('user_name');
        await interaction.reply('전적 검색 중...');
        await searchUser.update(userName);
    } else if (commandName === 'totallist') {
        await interaction.reply('전적 불러오는 중...');
        await totalList.update();
    }
});

client.login(botToken);