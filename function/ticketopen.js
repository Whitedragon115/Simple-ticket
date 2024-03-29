const { PermissionsBitField, ChannelType, ButtonStyle, TextInputStyle } = require('discord.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders')
const { QuickDB } = require('quick.db');

const db = new QuickDB({ filePath: 'database.sqlite' });
const { loginfo } = require('./ticketuser.js')
const { TicketAdmin, TicketCategory } = require('../config.json')
const { TicketCreate } = require('../lang.json')


function isNumeric(str) {
    // Check if the string is a number
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str));
}

async function OpenMsgSend(type, channel, inter, request) {
    //====== send the open ticket message when the ticket is open
    const embed = new EmbedBuilder()
        .setColor(0xffd966)
        .setTitle(TicketCategory[type].category)
        .setDescription(TicketCategory[type].openTicketDescription.description)

    if (request) {
        embed.addFields({ name: 'Request', value: `\`${request}\`` })
    }

    const closebtn = new ButtonBuilder()
        .setCustomId('ticket-close')
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder()
        .addComponents(closebtn)

    //====== check if the ticket is ping the admin
    const ping = TicketCategory[type].openTicketDescription.pingadmin == true ? `${inter.user}<@&${TicketAdmin}>` : `${inter.user}`;
    await channel.send({ content: ping, embeds: [embed], components: [row] })
}

function openmodal(interaction, value) {
    //====== open the ticket modal
    const ticketcategory = TicketCategory[value];
    const modal = new ModalBuilder()
        .setTitle(ticketcategory.openTicketDescription.modal.title)
        .setCustomId(`@ticket-modal_${value}`);

    const code = new TextInputBuilder()
        .setCustomId('input')
        .setRequired(true)
        .setLabel("Please provide your some information")
        .setPlaceholder(ticketcategory.openTicketDescription.modal.placeholder)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setMinLength(10)

    const actionone = new ActionRowBuilder().addComponents(code)
    modal.addComponents(actionone)
    interaction.showModal(modal)

}

async function openticket(Categorytype, interaction, client, request) {
    //====== find the category
    const ticketcategory = TicketCategory[Categorytype];
    const category = interaction.guild.channels.cache.get(ticketcategory.categoryId);
    if (!category) return interaction.reply({ content: "Category not found", ephemeral: true });

    //====== create the ticket channel
    const channel = await interaction.guild.channels.create({
        name: `${interaction.user.tag}-${ticketcategory.category}`,
        type: ChannelType.GuildText,
        parent: ticketcategory.categoryId,
        topic: interaction.user.id,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: TicketAdmin,
                allow: [PermissionsBitField.Flags.ManageChannels],
            },
        ],
    });

    if(!request){
        request = "No request provided"
    }

    //====== create the ticket json
    const json = {
        channel: channel.id,
        category: channel.parentId,
        type: TicketCategory[Categorytype].category,
        request: request,
        time: Math.floor(Date.now() / 1000).toString(),
        status: true,
        user:[]
    }

    //====== add the ticket to the user database
    const userid = interaction.user.id;
    await db.init()
    await db.add(`ticket.${userid}.ticketopen`, 1)
    await db.push(`ticket.${userid}.ticket`, json)

    //====== log the open ticket
    client.log("open", loginfo(interaction, json), interaction)

    const embed = new EmbedBuilder()
        .setTitle(TicketCreate.title)
        .setDescription(TicketCreate.description.replace('{channel}', channel));

    interaction.reply({ embeds: [embed], ephemeral: true })

    //====== use function to send the open ticket message
    OpenMsgSend(Categorytype, channel, interaction, request)

}

function ticketreopen(interaction){
    //====== open the reopen ticket modal
    const modal = new ModalBuilder()
        .setTitle('Reopen Ticket')
        .setCustomId('@ticket-reopenModal');
    
    const code = new TextInputBuilder()
        .setCustomId('input')
        .setRequired(true)
        .setLabel("Reason for reopening the ticket")
        .setPlaceholder('I forgot to ask something!')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(250)
    
    const actionone = new ActionRowBuilder().addComponents(code)
    modal.addComponents(actionone)
    interaction.showModal(modal)
}


module.exports = {
    openticket,
    openmodal,
    ticketreopen,
    isNumeric
}