const { ButtonStyle, permissionOverwrites } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, channelLink } = require('@discordjs/builders')
const { create } = require('discord-timestamps')
const { QuickDB } = require('quick.db')

const { CloseCategory, CreateTranscript, AutoDeleteTicket } = require('../../../config.json')
const { transcript } = require('../../../function/ticketclose.js')
const db = new QuickDB({ filePath: 'database.sqlite' });

module.exports = {
    customId: 'ticket-confirm-close',
    async execute(interaction, client) {

        const disabledButton = new ButtonBuilder()
            .setCustomId('disabled_button')
            .setLabel('Ticket Close')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const row = new ActionRowBuilder()
            .addComponents(disabledButton)

        await interaction.update({ components: [row] });

        const messages = await interaction.channel.messages.fetch({ limit: 1, after: 1 });
        const firstMessage = await messages.first();
        const firstMentionedMember = firstMessage.mentions.members.first();
        const userrow = new ActionRowBuilder()

        const userembed = new EmbedBuilder()
            .setColor(0x6eaadc)
            .setTitle('Ticket Close!')
            .setDescription(`Your ticket has been closed in ${interaction.guild.name}`)
            .setTimestamp();

        if (CreateTranscript) {
            try {
                await transcript(interaction).then(responseBody => {
                    const view = new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('View Transcript')
                        .setURL(responseBody.link.normallink)
                        .setEmoji({ name: '📜' })
                    const download = new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Download Transcript')
                        .setURL(responseBody.link.downloadlink)
                        .setEmoji({ name: '📥' });
                    userrow.addComponents(view, download)
                    firstMentionedMember.send({ embeds: [userembed], components: [userrow] });
                })
            } catch (error) {
                console.error('Error:', error);
                // 处理可能出现的错误
            }
        } else {
            firstMentionedMember.send({ embeds: [userembed] });
        }

        const targetCategory = interaction.guild.channels.cache.get(CloseCategory);
        await interaction.channel.setParent(targetCategory);

        const ticketopen = await db.get(`${firstMentionedMember.id}.ticketopen`);
        if (!ticketopen) {
            await db.set(`${firstMentionedMember.id}.ticketopen`, 0)
        } else {
            await db.sub(`${firstMentionedMember.id}.ticketopen`, 1);
        }

        const userticket = await db.get(`${firstMentionedMember.id}.ticket`)
        const index = userticket.findIndex(user => user.channel === interaction.channel.id);
        await db.set(`${firstMentionedMember.id}.ticket[${index}].status`, false)        

        const reopenbtn = new ButtonBuilder()
            .setCustomId('@ticket-reopen')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Reopen Ticket')

        const row2 = new ActionRowBuilder()
            .addComponents(reopenbtn)

        if (AutoDeleteTicket) {
            let time = await create(10, 'Relative')
            await interaction.channel.send(`##This ticket will be close in ${time}\nIf this is a mistake, please click the button below to reopen the ticket.`, { components: [row2] })
            return setTimeout(() => {
                interaction.channel.delete();
            }, 10000);
        }

        const embed = new EmbedBuilder()
            .setTitle('Ticket Close')
            .setDescription('This ticket is close, click Button below to delete this ticket')
            .setTimestamp()

        const deletebtn = new ButtonBuilder()
            .setCustomId('ticket-delete')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Delete Ticket')

        row2.setComponents(deletebtn, reopenbtn)

        interaction.channel.send({ embeds: [embed], components: [row2] })

    }
}