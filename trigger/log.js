const { Webhook } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders')
const { TicketLogChannel } = require('../config.json')

module.exports = {
    async log(type, info, interaction) {
        const channel = interaction.guild.channels.cache.get(TicketLogChannel);
        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks.find(wh => wh.token);


        info.then(jsoninfo => {
            switch (type) {
                case "open":

                    const openembed = new EmbedBuilder()
                        .setDescription(`Ticket has been opened by <@${jsoninfo.user.id}> in \`${jsoninfo.main.type}\` category`)
                        .addFields(
                            { name: 'request', value: `\`${jsoninfo.main.request}\``, inline: true },
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        )
                        .setThumbnail("https://i.imgur.com/13Vlj1R.png")
                        .setColor(0x6eaadc);
                        

                    webhook.send({
                        embeds: [openembed],
                        username: 'Ticket Open',
                    });
                    break;

                case "reopen":
                    const reopenembed = new EmbedBuilder()
                        .setDescription(`<@${jsoninfo.main.ticketowner}> ticket has been reopened by <@${jsoninfo.user.id}>`)
                        .addFields(
                            { name: 'reason', value: `\`${jsoninfo.main.reasone}\``, inline: true },
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        )
                        .setThumbnail("https://i.imgur.com/vVXc3tE.png")
                        .setColor(0x6eaadc);

                    webhook.send({
                        embeds: [reopenembed],
                        username: 'Ticket Reopen',
                    });
                    break;
                case "close":
                    const closeembed = new EmbedBuilder()
                        .setDescription(`<@${jsoninfo.main.ticketowner}> ticket has been closed by <@${jsoninfo.user.id}>`)
                        .setThumbnail("https://i.imgur.com/D2hTC8i.png")
                        .setColor(0x6eaadc);

                    if (jsoninfo.main.link.active) {
                        closeembed.addFields(
                            { name: 'transcript', value: `[\`View Online\`](<${jsoninfo.main.link.normal}>) **|** [\`Download here\`](<${jsoninfo.main.link.download}>)`, inline: true },
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        )
                    } else {
                        closeembed.addFields(
                            { name: 'transcript', value: `\`Transcript is not active\``, inline: true },
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>` }
                        )
                    }

                    webhook.send({
                        embeds: [closeembed],
                        username: 'Ticket Close',
                    });
                    break;
                case "delete":
                    const deleteembed = new EmbedBuilder()
                        .setDescription(`<@${jsoninfo.user.id}> ticket has been deleted by <@${jsoninfo.user.id}>`)
                        .addFields(
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel name', value: `__**${jsoninfo.main.channel}**__`, inline: true }
                        )
                        .setThumbnail("https://i.imgur.com/OzY82DD.png")
                        .setColor(0x6eaadc);

                    webhook.send({
                        embeds: [deleteembed],
                        username: 'Ticket Delete',
                    });
                    break;

                case "useradd":
                    const useraddembed = new EmbedBuilder()
                        .setDescription(`<@${jsoninfo.main.user}> has been added to the <@${jsoninfo.main.ticketowner}> ticket`)
                        .addFields(
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>`, inline: true }
                        )
                        .setThumbnail("https://i.imgur.com/FSyevk0.png")
                        .setColor(0x6eaadc);

                    webhook.send({
                        embeds: [useraddembed],
                        username: 'Ticket User Add',
                    });
                    break;

                case "userremove":
                    const userremoveembed = new EmbedBuilder()
                        .setDescription(`<@${jsoninfo.main.user}> has been removed from the <@${jsoninfo.main.ticketowner}> ticket`)
                        .addFields(
                            { name: 'time', value: `<t:${jsoninfo.main.time}:R>`, inline: true },
                            { name: 'channel', value: `<#${jsoninfo.main.channel}>`, inline: true }
                        )
                        .setThumbnail("https://i.imgur.com/FSyevk0.png")
                        .setColor(0x6eaadc);

                    webhook.send({
                        embeds: [userremoveembed],
                        username: 'Ticket User Remove',
                    });
                    break;
                default:
                    break;
            }

        })
    }
}