const { ButtonStyle, PermissionsBitField } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, channelLink } = require('@discordjs/builders')
const { QuickDB } = require('quick.db')

const { ReopenPing, memberrole, TicketAdmin } = require('../../../config.json')
const { loginfo } = require('../../../function/ticketuser.js')
const db = new QuickDB({ filePath: 'database.sqlite' });

module.exports = {
    customId: '@ticket-reopen',
    async execute(interaction, client, reasone) {
        //====== get the ticket owner
        const topic = await interaction.channel.topic;
        const ticketowner = await interaction.guild.members.fetch(topic)

        //====== get ticket owner database
        const userticket = await db.get(`ticket.${ticketowner.id}.ticket`)
        const index = userticket.findIndex(user => user.channel === interaction.channel.id);
        const ticketindex = await db.get(`ticket.${ticketowner.id}.ticket[${index}]`)

        //====== check if the ticket is already open
        if (ticketindex.status) return await interaction.reply({ content: '## Ticket already open!', ephemeral: true });

        await interaction.reply({ content: '## Ticket reopen!', ephemeral: true });
        await interaction.channel.setParent(ticketindex.category);

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
            ticketowner.send({ embeds: [userembed] });
        }

        //delete close msg and edit the reopen msg
        await interaction.channel.messages.fetch(interaction.message.id).then(msg => {
            msg.delete();
            interaction.channel.messages.fetch({ before: msg.id, limit: 1 }).then(msg => {
                msg.first().edit({ embeds: [embed] });
            })
        })

        //====== update the permission
        await interaction.channel.permissionOverwrites.set([
            { id: ticketowner.id, allow: PermissionsBitField.Flags.SendMessages },
            { id: TicketAdmin, allow: PermissionsBitField.Flags.ViewChannel },
            { id: memberrole, deny: PermissionsBitField.Flags.ViewChannel },
            { id: interaction.guild.roles.everyone, deny: PermissionsBitField.Flags.ViewChannel}
        ])

        db.set(`ticket.${ticketowner.id}.ticket[${index}].status`, true)

        //====== log the reopen
        if(!reasone) reasone = 'No reason provided'

        const json = {
            ticketowner: ticketowner.id,
            channel: interaction.channel.id,
            time: Math.floor(Date.now() / 1000).toString(),
            reasone: reasone
        }

        client.log('reopen', loginfo(interaction, json), interaction);
    }
};