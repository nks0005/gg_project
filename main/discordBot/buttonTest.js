const { InteractionResponseType } = require("discord-api-types/v9");
const { MessageActionRow, MessageButton, Client } = require("discord.js");
const { guildId, hellgate55ChannelId, statisticsChannelId, usersearchChannelId, botToken } = require('./config/config.json'); // 설정 값
const wait = require('node:timers/promises').setTimeout;

const Monitor = require('./modules/monitor');
const Hellgate = require('./modules/hellgate');
const Statistics = require('./modules/statistics');
const SearchUser = require('./modules/searchUser');
const TotalStat = require('./modules/totalstat');
const TotalList = require('./modules/totallist');


const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // 사용 목적 고지

client.on('ready', () => {
    console.log(`Logged ${client.user.tag}`);
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'button') {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('total')
                .setLabel('5v5 판수 통계')
                .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('match')
                .setLabel('5v5 조합 통계')
                .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                .setCustomId('findparty')
                .setLabel('5v5 파티 구해요')
                .setStyle('SUCCESS')
            );

        await interaction.reply({ content: '원하는 기능을 선택하세요. [파티 구해요] 기능을 사용하려면 디스코드 닉네임을 인게임 아이디로 만들어야합니다.\n예시) wanthealcome', components: [row] });

    }

    const filter = i => i.customId === 'total' || i.customId === 'match' || i.customId === 'findparty';
    const collector = interaction.channel.createMessageComponentCollector({ filter });

    collector.on('collect', async i => {
        const statistics = new Statistics.modules(client.guilds.cache.get(guildId).channels.cache.get(statisticsChannelId), 24);
        const totalList = new TotalList.modules(client.guilds.cache.get(guildId).channels.cache.get(statisticsChannelId), 20);
        const searchUser = new SearchUser.modules(client.guilds.cache.get(guildId).channels.cache.get("956318538937827348"));

        if (i.customId === 'total') {
            await i.reply({ content: '5v5 판수 통계 출력 <#994850279822463087>', ephemeral: true });
            await statistics.updateall();
        } else if (i.customId === 'match') {
            await i.reply({ content: '5v5 조합 통계 출력 <#994850279822463087>', ephemeral: true });
            await totalList.update();
        } else if (i.customId === 'findparty') {
            await i.reply({ content: '<#956318538937827348>채널에 구인 광고를 올렸습니다.', ephemeral: true });

            console.log(i.user.username);
            const userName = i.user.username;
            await searchUser.update(userName);

            await client.guilds.cache.get(guildId).channels.cache.get("956318538937827348").send({ content: `${userName}이 5v5 레드헬게 파티를 구하고 있습니다!` });
        }
    });


});
client.login(botToken);