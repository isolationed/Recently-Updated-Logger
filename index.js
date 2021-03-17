const superagent = require("superagent");
const Discord = require("discord.js");
const webhook = new Discord.WebhookClient("webook id", "webhook token");
const fs = require("fs");

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

setInterval(async () => {
    await superagent.get("https://search.roblox.com/catalog/json?CatalogContext=2&Category=6&SortType=3&ResultsPerPage=20").then(res => {
        res = res.body

        const logged = loadJSON("Logged.json")
        const blacklisted = loadJSON("Blacklisted.json")

        res.forEach(element => {
            function Check1(num) {
                return num === element.AssetId
            }
    
            function Check2(str) {
                return str === element.Creator
            }

            if (logged.some(Check1) || blacklisted.some(Check2)) return

            var created = element.CreatedDate
            created = created.replace(/[^0-9]/g, '')
            const unixTime = created
            const date = new Date(parseInt(unixTime))

            const Embed = new Discord.MessageEmbed()
                .setAuthor("Recently Updated Logger")
                .setTitle("New Model Uploaded/Updated")
                .setURL(`https://www.roblox.com/library/${element.AssetId}/`)
                .setThumbnail(`https://www.roblox.com/asset-thumbnail/image?assetId=${element.AssetId}&width=420&height=420&format=png`)
                .setImage("https://media.discordapp.net/attachments/694603273092595803/821839473733271602/fuck_you.jpg")
                .addField(`Information`, `**Name:** ${element.Name}\n**AssetId:** ${element.AssetId}\n**Creator:** ${element.Creator}\n**Created:** ${date.toLocaleDateString("en-US")}`)
                .setFooter("Logger created by Ex");

            try {
                webhook.send(`https://assetdelivery.roblox.com/v1/asset/?id=${element.AssetId}`, {
                    username: 'Joe Mama',
                    avatarURL: 'https://cdn.discordapp.com/icons/761664481062944810/a2968994580f8f86ba5e25e2baed41fe.png?size=128',
                    embeds: [Embed],
                });

                logged.push(element.AssetId)
                saveJSON("Logged.json", logged)
            } catch (error) {
                console.error('Error trying to send: ', error)
            }

        })
    })
}, 5000)

setInterval(() => {
    saveJSON("Logged.json", [])
}, 300000)