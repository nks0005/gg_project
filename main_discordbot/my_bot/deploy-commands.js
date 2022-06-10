const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, hellgate_guildId, BOT_TOKEN } = require('../../../config/discord_config.json');

const commands = [
        new SlashCommandBuilder().setName('hellgate').setDescription('1시간 이내 누가 도는지 확인합니다.')
    ]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(clientId, hellgate_guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);