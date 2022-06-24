// 등록

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { botToken } = require('./config/config.json');

const commands = [
        new SlashCommandBuilder().setName('match').setDescription('매칭에 대한 정보를 검색합니다.').addStringOption(option => option.setName('battle_id').setDescription('전투 아이디를 적습니다.').setRequired(true)),
    ]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(botToken);

rest.put(Routes.applicationGuildCommands("980050496897314836", "748345742158200832"), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);