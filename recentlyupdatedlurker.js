const Discord = require('discord.js');
const fs = require('fs');
const superagent = require('superagent');
const webhook = new Discord.WebhookClient('778290433007943710', 'M_pfZTySHjlUKJ5aRlJjwI_KVgqDashIwzPJEtzzbs73fhHRdyG81fZMLH_N9ve4ogAO')
const webhook2 =  new Discord.WebhookClient('795543660791595008', 'GneIfYgolpgiJ35MMoFIOXnVzFaBXgwhgN9-QD2rVWCx_qFmPWc53tywd8Y0120UWX3t')

function loadJSON(filename = '') {
    return JSON.parse(
        fs.existsSync(filename)
            ? fs.readFileSync(filename).toString()
            : 'null'
    )
}

function saveJSON(filename = '', json = '') {
    return fs.writeFileSync(filename, JSON.stringify(json, null, 2))
}

module.exports = {
    name: "recentlyupdatedlurker",
    description: "lurks through the recently updated page",
    execute() {
        setInterval(async () => {
            await superagent.get('https://search.roblox.com/catalog/json?CatalogContext=2&Category=6&SortType=3&ResultsPerPage=20').then(res => {
                res = res.body

                res.forEach(element => {

                    var created = element.CreatedDate
                    created = created.replace(/[^0-9]/g, '')
                    const unixTime = created;
                    const date = new Date(parseInt(unixTime));

                    function Check(num) {
                        return num === element.AssetId
                    }

                    const Embed = new Discord.MessageEmbed()
                        .setAuthor('Recently Updated')
                        .setTitle(`New Model Uploaded/Updated`)
                        .setURL(`https://www.roblox.com/library/${element.AssetId}/`)
                        .setThumbnail(`https://www.roblox.com/asset-thumbnail/image?assetId=${element.AssetId}&width=420&height=420&format=png`)
                        .setImage('https://cdn.discordapp.com/attachments/758757809696407618/794659993492258856/8b0a81c89789c9fc37881284865ae801.png')
                        .addField(`Information`, `**Name:** ${element.Name}\n**AssetId:** ${element.AssetId}\n**Creator:** ${element.Creator}\n**Created:** ${date.toLocaleDateString("en-US")}`)
                        .setFooter(`made by ex ok no more expose 😂😂😂`)

                    const data = loadJSON('Logged.json')

                    if (element.Name === "PSU ON TOP" || element.Creator === 'ByteEncode' || element.Creator === 'AntiVirusMasterMan23' || element.Creator === 'namedatawashere' || element.Creator === 'BIGCUTECATTO' || data.some(Check)) {
                        return
                    } else {
                        try {
                            webhook.send(`https://assetdelivery.roblox.com/v1/asset/?id=${element.AssetId}`, {
                                username: 'Poggers',
                                avatarURL: 'https://cdn.discordapp.com/icons/761664481062944810/a2968994580f8f86ba5e25e2baed41fe.png?size=128',
                                embeds: [Embed],
                            });
                            webhook2.send(`https://assetdelivery.roblox.com/v1/asset/?id=${element.AssetId}`, {
                                username: 'Poggers',
                                avatarURL: 'https://cdn.discordapp.com/icons/761664481062944810/a2968994580f8f86ba5e25e2baed41fe.png?size=128',
                                embeds: [Embed],
                            });
                            data.push(element.AssetId)
                            saveJSON('Logged.json', data)
                        } catch (error) {
                            console.error('Error trying to send: ', error);
                        };
                    }
                })
            })
        }, 5000);
        setInterval(() => {
            saveJSON('Logged.json', [])
        }, 300000);
    }
}