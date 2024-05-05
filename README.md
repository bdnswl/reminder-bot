
# reminder-bot


## How to use

Clone the project

```bash
  git clone https://github.com/bdnswl/reminder-bot.git
```

Go to the project directory

```bash
  cd reminder-bot
```
#### If you don't have node.js, install it from https://nodejs.org/

You'll need discord.js, which can be installed with

```bash
  npm install discord.js
```

Next, edit `userID.txt` with your ID, which can be found one of two ways.
- (Recommended) Go into your discord settings, then go to `Advanced` under `App Settings` and turn Developer Mode on. Now either click on your profile on the bottom left corner or right click on your profile elsewhere, and click 'Copy User ID' at the bottom.
- Type out an @ that mentions yourself in a channel, then put a backslash `\` before it. Press enter and <@{YOUR ID}> will show up in the channel.
Once you have your id, paste it into `userID.txt.`

After you've done that, you'll need to get a bot token for the bot account you're using and put it in `botToken.txt`

## Creating a bot
Go to https://discord.com/developers and sign in if you aren't already signed in. On the applications page, which should be the default, click the blue 'New Application' button in the top right. Give it a name and click the checkbox and confirm it.

You'll want to upload a picture and name it on the next page; although this is only for you.

Go to the page called 'Bot' on the settings bar on the left. I recommend using the same picture for the bot icon and the 'app' icon so you don't get confused. What you put on this page is what people will see on servers.

Scroll down to the section called `Privileged Gateway Intents`. You're going to want to turn all three of them on if you want all of the features to work.

Now go back up to where it says `TOKEN` under the space where you enter the bot's username and upload an icon and banner. Click `Reset Token`, then enter your password and a token will be generated for you. Copy it and save it, because you only get it once.

Paste the token into `botToken.txt`
## Add your bot to a server
To add your bot to a server, go to the `OAuth2` section on the left of the application page. In the big menu with lots of checkboxs, find `bot` (it should be on the rightmost column around the middle) and click on it. Now click on the checkboxes for the permissions you want it to have, and it'll make an invite link.

You can put the invite link in your browser and it'll bring up the menu to add the bot to a server. It's worth noting that you need `Manage Server` permissions for the server you want to add it to, as well as access to all the permissions you choose to give it in the `BOT PERMISSIONS` section when you generate the link. 

For this bot to work, I recommend giving the permissions `Read Messages/View Channels`, `Send Messages`, `Read Message History`, and `Mention Everyone`. However, since you run the bot yourself, you can just give it `Administrator` and save a little time.
## Running the bot
Using the link you made in the previous section, you can add the bot to a server. 

To run the bot, open a command prompt in the folder with all of the files and run

```bash
node reminderbot.js
```
Once it's ready, it'll say `ready` in the command prompt window, and from there you're good to go.
## Commands
Currently, the bot supports a few different commands:


### !remind
```
!remind [hours] [minutes] {message}
```
Sets a reminder for [hours] and [minutes] from now. Everything you write after [minutes] will be in the message that comes when your reminder is over.
### !clearReminders
This command clears all of your active reminders.
### !reminders
Lists all of your active reminders.
### !eval
```
!eval {javascript code}
```
Only works if the user entering the command is the person defined by `myID` (the id you put in userID.txt). Runs whatever code you put in the console, for advanced users only.
### !addCommand
```
!addCommand [commandName] {response}
```
Adds a command that can be run with !commandName and returns whatever you put as the response. If one already exists with the name, it will tell you that and the command will fail.
### !removeCommand
```
!removeCommand [commandName]
```
If a custom command exists with the provided name, removes it.
### !commands
Returns all custom commands that have been added.
## Extra Functionality
As of this version of the readme, the bot will send a message any time someone leaves a server it's in. By default it will look for a leave-log channel, and if one doesn't exist, the messages will go in the default system message channel (wherever the join messages come in).