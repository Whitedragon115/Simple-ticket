const { PermissionsBitField, ChannelType } = require('discord.js');
const readline = require('readline');
const fs = require('node:fs');
const path = require('node:path');
const { TicketChannel, TicketLogChannel, CloseCategory, TicketCategory, memberrole, TicketAdmin, TicketBlacklist, clientId, guildId } = require('../config.json');
const { log } = require('console');

const configpath = path.join(__dirname, '../config.json');
const configdata = fs.readFileSync(configpath);
const jsondata = JSON.parse(configdata);
function execute() {
    fs.writeFileSync(configpath, JSON.stringify(jsondata, null, 2));
};

function editdata(option, newdata) {
    //====== edit the channel id in the config file
    if (jsondata.hasOwnProperty(option)) {
        jsondata[option] = newdata;
        execute();
        return true;
    } else {
        console.log(`Property '${option}' does not exist in jsondata.`);
        return false;
    }
}

function editcategorydata(newdata, index) {
    //====== edit the category id in the config file
    const category = jsondata.TicketCategory[index];
    if (category) {
        jsondata.TicketCategory[index].categoryId = newdata;
        execute();
        return true;
    } else {
        console.log(`Property 'TicketCategory' does not exist in jsondata.`);
        return false;
    }
}


function readlineSync(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function creatchannel(guild, name) {
    //====== create a channel
    const channel = await guild.channels.create({
        name: name,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: memberrole,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: TicketAdmin,
                allow: [PermissionsBitField.Flags.ManageChannels],
            },
        ],
    });

    return channel;
}

async function creatcategory(guild, name) {
    //====== create the category
    const channel = await guild.channels.create({
        name: name,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: memberrole,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: TicketAdmin,
                allow: [PermissionsBitField.Flags.ManageChannels],
            },
        ],
    });

    return channel;
}

async function rolecheck(client) {
    const guild = await client.guilds.fetch(guildId);
    let sucess = true;

    //====== check if the role is exist
    if (!memberrole || guild.roles.cache.get(memberrole) == undefined) {
        console.log('Member Role not found');
        sucess = false;
    }
    if (!TicketAdmin || guild.roles.cache.get(TicketAdmin) == undefined) {
        console.log('Ticket Admin Role not found');
        sucess = false;
    }
    if (!TicketBlacklist || guild.roles.cache.get(TicketBlacklist) == undefined) {
        console.log('Ticket Blacklist Role not found');
        sucess = false;
    }

    return sucess;
}

async function channelcheck(client) {
    const guild = await client.guilds.fetch(guildId);

    const ticketChannelExists = await checkChannel(guild, TicketChannel, "TicketChannel");
    const ticketLogChannelExists = await checkChannel(guild, TicketLogChannel, "TicketLogChannel");
    let allTicketCategoriesExist = true;
    for (let i = 0; i < TicketCategory.length; i++) {
        const ticketCategoryExists = await checkChannel(guild, TicketCategory[i].categoryId, "Ticket Category type", true, i);
        allTicketCategoriesExist = allTicketCategoriesExist && ticketCategoryExists;
    }

    const closeCategoryExists = await checkChannel(guild, CloseCategory, "CloseCategory", true);

    return ticketChannelExists && ticketLogChannelExists && allTicketCategoriesExist && closeCategoryExists;
}

async function checkChannel(guild, channelId, channelName, category, i) {
    if (!guild.channels.cache.get(channelId)) {
        console.log(`${channelName} not found`);
        if (!channelId) {
            if (await readlineSync(`Create one for you? (y/n) for ${channelName}: `) == 'y') {
                const name = await readlineSync(`Enter the name of the ${channelName}: `);
                if (category) {
                    const newChannel = await creatcategory(guild, name);
                    if (channelName == "CloseCategory") {
                        editdata(channelName, newChannel.id);
                    } else {
                        editcategorydata(newChannel.id, i);
                    }
                } else {
                    const newChannel = await creatchannel(guild, name);
                    editdata(channelName, newChannel.id);
                }
                console.log(`Successfully create ${name}\n-----------------------------`);
            } else {
                return false;
            }
        }
        return false;
    }
    return true;
}

async function check(client) {

    await rolecheck(client).then((res) => {
        if (!res) {
            console.log('! Please check your role in config.json !')
            return process.exit(1);
        }
    });

    await channelcheck(client).then((res) => {
        if (!res) {
            console.log('! Please check your channel in config.json !')
            return process.exit(1);
        }
    });

    await logwebhook(client);

}

function PermCheck(interaction) {
    //====== check if the user have the permission to use the command
    if (!interaction.member.roles.cache.has(TicketAdmin)) {
        interaction.editReply({ content: `## You do not have the permission to use this command`, ephemeral: true });
        return true;
    }
}

function ChannelCheck(interaction) {
    //====== check if the command is used in ticket channel
    for (const category of TicketCategory) {
        if (interaction.channel.parentId == category.categoryId) {
            return false;
        }
    }

    return interaction.editReply({ content: `## You can only use this command in ticket channel`, ephemeral: true });
}

async function logwebhook(client) {

    //====== check if there is a webhook in the ticket log channel
    const channel = await client.channels.fetch(TicketLogChannel);
    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.token);

    if (!webhook) {
        await channel.createWebhook({
            name: 'Ticket Log',
            avatar: 'https://i.imgur.com/SKLpVHC.png'
        }).then(res => {
            webhook = res.find(wh => wh.token);
        })
    }
}

module.exports = {
    check,
    editdata,
    PermCheck,
    ChannelCheck
}