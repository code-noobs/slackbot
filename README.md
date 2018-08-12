# slackbot
Code Noobs Slackbot for DNS, who.is


Inspired by https://github.com/bradtraversy/slack_jokebot/ great tutorial!

End-goal is to have a Slackbot that can take domains and give who.is/DNS records, possibly github repos.

who.is API: https://whoisxmlapi.com DNS API: https://dns-api.org

Working commands: 

dns + [domain] returns A, NS, MX, TXT records for [domain] 

whois + [domain] returns contact email, registrant, admin contact, as well as created, updated, expired dates.
