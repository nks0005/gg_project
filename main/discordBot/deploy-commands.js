// 등록
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { botToken } = require('./config/config.json');

const commands = [
        new SlashCommandBuilder().setName('search').setDescription('24시간 내 5v5 헬게 통계 치를 얻어옵니다.'),
    ]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(botToken);
rest.put(Routes.applicationGuildCommands("980050496897314836", "748345742158200832"), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);