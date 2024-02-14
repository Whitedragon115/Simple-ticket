const { ButtonStyle, PermissionsBitField } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, channelLink } = require('@discordjs/builders')
const { QuickDB } = require('quick.db')

const { ReopenPing, clientId } = require('../../../config.json')
const db = new QuickDB({ filePath: 'database.sqlite' });

module.exports = {
    customId: '@ticket-reopen',
    async execute(interaction, client, reasone) {

        const messages = await interaction.channel.messages.fetch({ limit: 1, after: 1 });
        const firstMessage = await messages.first();
        const firstMentionedMember = firstMessage.mentions.members.first();

        const userticket = await db.get(`${firstMentionedMember.id}.ticket`)
        const index = userticket.findIndex(user => user.channel === interaction.channel.id);
        const ticketindex = await db.get(`${firstMentionedMember.id}.ticket[${index}]`)
        // if (ticketindex.status) return await interaction.reply({ content: '## Ticket already open!', ephemeral: true });

        // await interaction.channel.fetch(interaction.message.id).then(msg => {
        //     msg.delete()
        //     interaction.channel.fetch({ before: msg.id, limit: 1 }).then(msg => {
        //         msg.delete()
        //     })
        // })

        interaction.channel.permissionOverwrites.set([
            { id: firstMentionedMember.id, allow: PermissionsBitField.Flags.SendMessages }
        ])

        await interaction.channel.setParent(ticketindex.category);
        await interaction.reply({ content: '## Ticket reopen!', ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor(0x6eaadc)
            .setTitle('Ticket Reopen!')
            .setDescription(`Hey your ticket has been reopened`)
            .setTimestamp();

        if (ReopenPing) {
            const userembed = new EmbedBuilder()
                .setColor(0x6eaadc)
                .setTitle('Ticket Reopen!')
                .setDescription(`Hey your ticket has been reopened in below\n${interaction.channel}`)
                .addFields({ name: 'Here is the reason', value: `\`${reasone}\`` })
                .setTimestamp();
            firstMentionedMember.send({ embeds: [userembed] });
        }

        await interaction.channel.send({ embeds: [embed] });
        db.set(`${firstMentionedMember.id}.ticket[${index}].status`, true)
    }
};