const Discord = require("discord.js")
const fs = require("fs")

const botid = "682681577083633763",
      bottoken =  fs.readFileSync("botToken.txt", "utf8"),
      myID = fs.readFileSync("userID.txt", "utf8")

const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildInvites
    ],
})

var server,
    reminders = {},
    customCommands = [],
    usedCommandNames = ["remind", "reminders", "clearreminders", "addCommand", "removeCommand", "commands", "eval"]

const backUpReminders = () => fs.writeFileSync("./reminders.json", JSON.stringify(reminders))
const backUpCustoms = () => fs.writeFileSync("./customCommands.json", JSON.stringify(customCommands))
const convertToDiscordTime = t => String(t).slice(0,-3)
const nowToDiscordTime = () => String(new Date().getTime()).slice(0,-3)

function checkReminders() {
    p = Object.values(reminders)
    p.forEach(d => {
        num = d["num"]
        id = d["id"]
        time = d["time"]
        msg = d["msg"]
        channel = d["channel"]
        if (time == -1) 
            return
        if (time <= Date.now()) {
            let x = bot.channels.cache.get(channel)
            x.send("<@" + id + "> your reminder saying: " + msg + " has ended.")
            d["time"] = -1
            delete reminders[num]
            backUpReminders()
        }
    })
}

bot.on("ready", () => {	console.log("ready")

	bot.user.setActivity("!remind | !reminders | !clearreminders")

    reminders = fs.readFileSync("./reminders.json")
    reminders = JSON.parse(reminders)
    customCommands = fs.readFileSync("./customCommands.json")
    customCommands = JSON.parse(customCommands)
    customCommands.forEach(c => {
        usedCommandNames.push(c[0])
    })

    setInterval(checkReminders, 60 * 1000)
})

bot.on("messageCreate", async message => {
    if (message.author.bot)
        return

    if (message.content == "") 
        return
    
    var args = message.content.split(" ")

    customCommands.forEach(c => {
        if (args[0].slice(1) == c[0]) {
            message.channel.send(c[1])
            return
        }
    })

    args = args.slice(1)

    if (message.content.startsWith("!eval ") && message.author.id == myID) {
        eval((args.join(" ")))
    }

    if (message.content.startsWith("!clearreminders")) {
        let id = message.author.id
        let nums = []
        p = Object.values(reminders)
        p.forEach(r => {
            if (r["id"] == id) {
                nums.push(r["num"])
            }
        })

        nums.forEach(n => {
            reminders[n]["time"] = -1
            reminders[n]["id"] = -1
            delete reminders[n]
        })
        backUpReminders()
        message.channel.send("Reminders successfully cleared for <@" + id + ">")
    }

    if (message.content.startsWith("!remind ")) {
        if (args[0].toLowerCase == "help") {
            message.reply("!remind [hours] [minutes] {optional message}")
        }

        let hours = Number(args[0])
        let mins = Number(args[1])

        if (isNaN(hours) || isNaN(mins)) {
            message.channel.send("!remind [hours] [minutes] {optional message}")
            return
        }

        args = args.slice(2)
        let name = message.author.id

        let msg = args.join(" ")

        t = 3600 * hours * 1000 + mins * 1000 * 60 // t is in minutes, convert to ms
        let p = Object.values(reminders)
        num = 0
        if (p.length > 0)
            num = Number(p[p.length - 1]["num"]) + 1

        reminders["" + num] = {"num": "" + num, "id": name, "time": Number(Date.now() + t), "msg": msg, "channel": message.channel.id}
        message.channel.send("Reminder set!")
        backUpReminders()
    }

    if (message.content.startsWith("!reminders")) {
        counter = 1
        let id = message.author.id
        p = Object.values(reminders)
        let num = 1
        let rems = []

        p.forEach(r => {
            if (r["id"] == id && r["time"] != -1) {
                rems.push(r)
            }
        })

        if (rems.length == 0) {
            message.channel.send("No reminders found for <@" + id + ">!")
            return
        }

        for (let i = 0; i < rems.length; i++) {
            setTimeout(() => {
                r = rems[i]
                let d = new Date(r["time"])
                t = convertToDiscordTime(d.getTime())
                message.channel.send("**" + counter + ".** Reminder called ``" + r["msg"] + "`` that ends at <t:" + t + ":t>")
                counter++
            })
            
        }

    }

    if (message.content.startsWith("!addCommand ")) {
        if (usedCommandNames.indexOf(args[0]) != -1) {
            message.reply("That command name is already in use. Pick a new one.")
            return
        }

        cmdName = args[0]
        args.splice(0,1)
        cmdResponse = args.join(" ")
        customCommands.push([cmdName, cmdResponse, message.author.id, nowToDiscordTime()])
        usedCommandNames.push(cmdName)
        backUpCustoms()
        message.reply("Command added successfully. Type !" + cmdName + " to use it.")
    }

    if (message.content.startsWith("!removeCommand ")) {
        commandNames = []
    
        customCommands.forEach(c => {
            commandNames.push(c[0])
        })

        cmd = customCommands.find(c => c[0] == args[0])

        if (cmd) {
            cmdName = cmd[0]
            cmdResponse = cmd[1]
            message.reply("Command " + cmdName + ", added by " + cmd[2] + " on <t:" + cmd[3] + ":f> which previously returned:\n```" + cmdResponse + "```\nHas been removed.")
            index = customCommands.indexOf(cmd)
            customCommands.splice(index, 1)
            backUpCustoms()
            index = usedCommandNames.indexOf(cmd)
            usedCommandNames.splice(index,1)
        }
        else {
            message.reply("Command not found. Check your spelling or check the list with !commands.")
        }
    }

    if (message.content.startsWith("!commands")) {
        if (customCommands.length == 0) {
            message.reply("There are currently no custom commands. Add some and try again.")
            return
        }
        block = ""
        counter = 0
        customCommands.forEach(c => {
            block += "!" + c[0] + " added by <@" + c[2] + "> on <t:" + c[3] + ":f>\n"
            counter++
            if (counter > 9) {
                message.channel.send(block)
                block = ""
                counter = 0
            }
        })
        if (counter)
            message.channel.send(block)
    }
})

bot.on("guildMemberRemove", member => {
    leaveMessage = member.displayName + " (<@" + member.id + ">) has left the server."
    leaveLogChannel = member.guild.channels.cache.find(c => c.name == "leave-log") || member.guild.systemChannel
    leaveLogChannel.send(leaveMessage)
})

bot.on("error", console.log)
bot.login(bottoken)
