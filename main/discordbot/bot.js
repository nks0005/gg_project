const Discord = require('discord.js');
const token = require('../../../config/discord_config.json');
const process = require('./process');

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // Client 객체 생성

// discord 봇이 실행될 때 딱 한번 실행할 코드를 적는 부분
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

});



client.on('message', msg => {
    try {
        //if (msg.content === '!ping') msg.channel.send(`pong`); // 채팅에서 메시지가 들어왓을 때 실행할 콜백 함수

        if (msg.content === '!help') msg.channel.send(`
        > !hellgate : 헬게이트를 도는 유저가 있는지 확인
        `);

        if (msg.content === '!hellgate') {
            process.hellgate(msg);
        }


    } catch (e) {
        console.log(e);
    }
});

client.login(token.BOT_TOKEN);