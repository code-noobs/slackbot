# Slackbot
Code Noobs Slackbot for DNS, who.is


Inspired by https://github.com/bradtraversy/slack_jokebot/ great tutorial!

End-goal is to have a Slackbot that can take domains and give who.is/DNS records, possibly github repos.
### APIs used
[Slack API](https://api.slack.com/) - [Who.Is API](https://whoisxmlapi.com/) - [DNS API](https://dns-api.org)

Working commands: 

dns + (domain) returns A, NS, MX, TXT records for (domain)

whois + (domain) returns contact email, registrant, admin contact, as well as created, updated, expired dates.

## Installation
**This is a Node.JS app, you must have Node.JS installed on the machine prior to following these instructions**

Most of the work should be in getting the API keys you need from each and plugging it in. For Slack you'll need to specify that you're creating a bot, and this process can be found in the repo I mention above. You'll also need to create a #bot-testing channel on your Slack workspace, but you can replace the code to modify this (typing this out, I should probably make this a varible). Check the Who.Is API documents for finding your API key there. It'd be recommended to use something like dotenv to plug these in, but if you just want to get it running you can just replace the variables.

This is still in testing, but from what I've found you should be able to npm install from there and have it runnning on your Slack workspace.
