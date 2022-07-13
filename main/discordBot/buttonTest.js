const { InteractionResponseType } = require("discord-api-types/v9");
const { MessageActionRow, MessageButton, Client } = require("discord.js");
const { guildId, hellgate55ChannelId, statisticsChannelId, usersearchChannelId, botToken } = require('./config/config.json'); // 설정 값
const wait = require('node:timers/promises').setTimeout;


const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
}); // 사용 목적 고지

client.on('ready', () => {
    console.log(`Logged ${client.user.tag}`);
});

client.on('message', async message => {
    if (message.content.startsWith('!reply')) {
        message.lineReply('Hey'); //Line (Inline) Reply with mention

        message.lineReplyNoMention(`My name is ${client.user.username}`); //Line (Inline) Reply without mention
    }
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
            );

        await interaction.reply({ content: '버튼 테스트!', components: [row] });

    }

    const filter = i => i.customId === 'total' || i.customId === 'match';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        if (i.customId === 'total') {
            //await i.deferUpdate();
            await i.reply({ content: '5v5 판수 통계 출력 <#994850279822463087>', components: [], ephemeral: true });
        } else if (i.customId === 'match') {
            await i.reply({ content: '5v5 조합 통계 출력 <#994850279822463087>', components: [], ephemeral: true });
        }
    });

    collector.on('end', collected => console.log(`Collected ${collected.size} items`));

});
client.login(botToken);