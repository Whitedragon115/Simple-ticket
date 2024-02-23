const { Webhook } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')
const { TicketLogChannel } = require('../config.json')

module.exports = {
    async log(type, info, interaction) {
        const channel = interaction.guild.channels.cache.get(TicketLogChannel);
        info.then(jsoninfo => {
            switch (type) {
                case "open":
                    const openembed = new EmbedBuilder()
                        .setTitle('Ticket Opened')
                        .setDescription(`Ticket has been opened by <@${jsoninfo.user.id}> in \`${jsoninfo.main.type}\` category`)
                        .addFields(
                            { name: 'request', value: `\`${jsoninfo.main.request}\``, inline: true },
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        )
                        .setColor(0x6eaadc);

                    channel.send({ embeds: [openembed] });
                    break;

                case "reopen":
                    const reopenembed = new EmbedBuilder()
                        .setTitle('Ticket Reopened')
                        .setDescription(`<@${jsoninfo.main.ticketowner}> ticket has been reopened by <@${jsoninfo.user.id}>`)
                        .addFields(
                            { name: 'reason', value: `\`${jsoninfo.main.reasone}\``, inline: true },
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        )
                        .setColor(0x6eaadc);

                    channel.send({ embeds: [reopenembed] });
                    break;
                case "close":
                    const closeembed = new EmbedBuilder()
                        .setTitle('Ticket Closed')
                        .setDescription(`<@${jsoninfo.main.ticketowner}> ticket has been closed by <@${jsoninfo.user.id}>`)
                        // .addFields(
                        //     { name: 'transcript', value: `\` [View Online](<${jsoninfo.main.link.normal}>) | [Download here](<${jsoninfo.main.link.download}>) \``, inline: true },
                        //     { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                        //     { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        // )
                        .setColor(0x6eaadc);

                        if(jsoninfo.main.link.active){
                            closeembed.addFields(
                                { name: 'transcript', value: `[\`View Online\`](<${jsoninfo.main.link.normal}>) **|** [\`Download here\`](<${jsoninfo.main.link.download}>)`, inline: true },
                                { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                                { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                            )
                        }else{
                            closeembed.addFields(
                                { name: 'transcript', value: `\`Transcript is not active\``, inline: true },
                                { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                                { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                            )
                        }

                    channel.send({ embeds: [closeembed] });
                    break;
                case "delete":
                    const deleteembed = new EmbedBuilder()
                        .setTitle('Ticket Deleted')
                        .setDescription(`<@${jsoninfo.user.id}> ticket has been deleted by <@${jsoninfo.user.id}>`)
                        .addFields(
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel name', value: `__**${jsoninfo.main.channel}**__`, inline: true}
                        )
                        .setColor(0x6eaadc);

                    channel.send({ embeds: [deleteembed] });
                    break;

                case "useradd":
                    const useraddembed = new EmbedBuilder()
                        .setTitle('User Added')
                        .setDescription(`<@${jsoninfo.user.id}> has been added to the ticket by <@${jsoninfo.main.ticketowner}>`)
                        .addFields(
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>`, inline: true }
                        )
                        .setColor(0x6eaadc);

                    channel.send({ embeds: [useraddembed] });
                    break;
            }

        })
    }
}