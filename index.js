const superagent = require("superagent");
const Discord = require("discord.js");
const webhook = new Discord.WebhookClient("821823410228822057", "6OdRhxOmYOcDEv8MFCVueucg3OI3n-DNMbksg8jRkuWtXFIHRrfyKuEQ4BLRY2dGd4ED");
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

        res.forEach(element => {
            const data = loadJSON("./logged.json")

            if (element.Creator === "") return `Blacklisted Creator: ${element.Creator}`
            data.forEach(assetid => {
                if (element.AssetId === assetid) return console.log("Already Logged")
            })
        })
    })
}, 5000)