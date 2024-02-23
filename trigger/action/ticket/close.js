const { ButtonStyle } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders')
const { TicketAdmin, AllowUserCloseTicket, CloseCategory } = require('../../../config.json')

module.exports = {
    customId: 'ticket-close',
    async execute(interaction, client) {

        //====== check if the user is allowed to close the ticket
        if(!AllowUserCloseTicket){
            if(!interaction.member.roles.cache.has(TicketAdmin)){
                return interaction.reply({ content:'**Sorry you can\'t close the ticket**', ephemeral:true })
            }
        }

        //====== check if the ticket is already closed
        if(interaction.channel.parentId == CloseCategory){
            return interaction.reply({ content:'**This ticket has been closed**', ephemeral:true })
        }

        //====== create the confirm close button
        const embed = new EmbedBuilder()
            .setColor(0xf44336)
            .setTitle('Confirm Close Ticket')
            .setDescription('> Are you sure to close the ticket?')
        
        const closebtn = new ButtonBuilder()
            .setCustomId('ticket-confirm-close')
            .setStyle(ButtonStyle.Danger)
            .setLabel('close!')
        
        const row = new ActionRowBuilder()
            .setComponents(closebtn)

        interaction.reply({ embeds:[embed], components:[row], ephemeral:true })
        

    }
};