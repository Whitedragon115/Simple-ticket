const { EmbedBuilder } = require('@discordjs/builders')
const dt = require('discord-html-transcripts');
const fs = require('fs');
const request = require('request');

function time() {
    //====== return the formatted time
    const currentDate = new Date();

    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    return `${month}-${day}_${hours}-${minutes}-${seconds}`;
}

async function transcript(interaction) {
    return new Promise(async (resolve, reject) => {
        const msg = await interaction.channel.send("Creating transcript...")

        //====== create the transcript function
        const tsfile = await dt.createTranscript(interaction.channel, {
            returnType: 'string',
            poweredBy: false,
            footerText: 'There are total {number} of message{s} sent'
        });

        //====== write the transcript to the file in ./tmp folder
        const localFilePath = `./function/tmp/${interaction.user.tag}_${time()}.html`;
        fs.writeFileSync(localFilePath, tsfile);

        //====== upload the transcript to the server setting
        const options = {
            url: 'http://ticket.dragoncode.dev/api/upload',
            method: 'POST',
            formData: {
                // read the file from the tmp folder
                file: fs.createReadStream(localFilePath)
            }
        };

        //====== set up a timeout promise
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const json = {
                    timeout: true,
                    link: {
                        normallink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        downloadlink: 'https://www.youtube.com/watch?v=8ybW48rKBME'
                    }
                }
                // reject(json);
                resolve(json);
            }, 10000); // 设置超时为10000毫秒（即10秒）
        });

        //====== race between main operation and timeout
        Promise.race([requestOperation(options, localFilePath), timeoutPromise]).then(responseBody => {
            const json = JSON.parse(responseBody);
            

            const embed = new EmbedBuilder()
                .setColor(0x6eaadc)
                .setTitle('Transcript Created!')
                .addFields(
                    { name: 'Transcript Link', value: `[View Online!](<${json.link.normallink}>)`, inline: true },
                    { name: 'Transcript Download', value: `[Download here](<${json.link.downloadlink}>)`, inline: true }
                )
                .setTimestamp();
            if(json.timeout){
                embed.setDescription('The transcript is taking too long to generate, please **do not click the link below!**\n_yes don\'t click it, you might get hack by me_')
            }

            msg.edit({ content: "", embeds: [embed] });
            resolve(json);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function requestOperation(options, localFilePath) {
    return new Promise((resolve, reject) => {
        //====== upload the file to the server
        request(options, (error, response, body) => {
            fs.unlinkSync(localFilePath);
            resolve(body);
        });
    });
}

module.exports = {
    transcript,
}
