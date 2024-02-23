const { create } = require('discord-timestamps')
const { loginfo } = require('../../../function/ticketuser.js')
module.exports = {
    customId: 'ticket-delete',
    async execute(interaction, client) {

        //====== create the timestamp
        let time = await create(10, 'Relative')
        await interaction.reply(`## This ticket will be close in ${time}`)

        //====== log the delete, and delete the channel
        const json = {
            ticketowner: interaction.channel.topic,
            channel: interaction.channel.name,
            time: Math.floor(Date.now() / 1000).toString()
        }
        
        setTimeout(() => {
            interaction.channel.delete();
            client.log("delete", loginfo(interaction, json), interaction);
        }, 10000);
        
    }
};