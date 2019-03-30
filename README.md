# Slackbot
Code Noobs Slackbot for DNS, who.is


End-goal is to have a Slackbot that can take domains and give who.is/DNS records, possibly github repos.
### APIs used
[Slack](https://api.slack.com/) - [Who.Is](https://whoisxmlapi.com/) - [DNS](https://dns-api.org)

### Working commands: 

(domain) + dns returns A, NS, MX, TXT records for (domain)

(domain) + whois returns contact email, registrant, admin contact, as well as created, updated, expired dates.

## Installation
**This is a Node.JS app, you must have Node.JS installed on the machine prior to following these instructions**

Most of the work should be in getting the API keys you need from each and plugging it in. You can define your Slack channel on line 15, how this is handled is subject to change.

For Slack you'll need to specify that you're creating a bot, and that process can be found in [this tutorial](https://api.slack.com/bot-users). You'll also need to create a #bot-testing or the name you replaced the channel with earlier and invite your bot.

Check [here](https://whoisapi.whoisxmlapi.com/products) for your Who.Is API key once you've signed up. You'll also be taken to that page when you sign in. It'd be recommended to use something like dotenv to plug these in, but if you just want to get it running you can just replace the variables on lines 11 (Slack) and 149 (Who.Is). 

The DNS API should run on it's own, but if you're putting this into production you should [install it on your own instance](https://github.com/skx/dns-api-go).

This is still in testing, but from what I've found you should be able to npm install from there and have it runnning on your Slack workspace.

## FAQ

### My instance is running (getting back the requested data) but my messages aren't posting?

Be sure to invite your bot to the channel you're posting to (the default is #bot-testing, which will need to be created if you don't define a channel you want), it should then post the messages.

### My instance seems to be running, but won't respond after being idle for ~48 hours?

Ensure your Slackbots module is on version 1.2.0 which introduced ws-heartbeat to avoid websockets closing when idle, and if using pm2 don't run in cluster mode.
