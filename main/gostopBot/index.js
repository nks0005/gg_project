const { Client } = require("discord.js"); // discord 봇 모듈
const { botToken } = require('./config/config.json'); // 설정 값

const Monitor = require('./modules/monitor');

const serverId = "477808861663854592";
const channelId = "682053383087325197";

var sequelize = require('./models/index.js').sequelize;
sequelize.sync();

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // 사용 목적 고지

client.on('ready', () => {
    console.log(`Logged ${client.user.tag}`);

    const monitor = new Monitor.modules(50, 5000, client.guilds.cache.get(serverId).channels.cache.get(channelId));
    monitor.updateCycle();
});


client.login(botToken);