const { SlashCommandBuilder } = require('@discordjs/builders');
const { } = require('discord.js')
const { TicketLogChannel } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('a test command'),

    async execute(interaction) {

        const channel = interaction.guild.channels.cache.get(TicketLogChannel);
        const webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.find(wh => wh.token);

        await webhook.send({
            username: 'test',
            content: '## start up!',
            avatarURL: 'https://i.imgur.com/MONQ1kq.png',
        });


    },
};