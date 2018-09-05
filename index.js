const SlackBot = require('slackbots');
const axios = require('axios');
const https = require('https');
const querystring = require('querystring');
const env = require('dotenv');

env.config({path: 
        '.env'});

const bot = new SlackBot({
	token: process.env.SLACK_API_TOKEN,
	name: 'Code Noobs Bot'
});

const slackChannel = 'bot-testing';
const dnsApi = 'https://dns-api.org/';

// Start Handler
bot.on('start', () => {
	const params = {
	icon_emoji: ':linkms:'
	};

	bot.postMessageToChannel(slackChannel, "Don't panic", params);
});

// Error Handler
bot.on('error', err => console.log(err));

// Mesage Handler
bot.on('message', (data) => {
	if(data.type !== 'message'){
	return;
	}
	console.log(data);
	handleMessage(data.text);
});



// Respond to Data
function handleMessage(message) {
    function removeID() {
        if(message.includes('@')){ // Use Node Buffer to remove ID
        var buf1 = Buffer.allocUnsafe(26);
        buf1 = message;
        buf2 = buf1.slice(13, buf1.length);
        return buf2.toString('ascii', 0, buf2.length);
        }
        else {
          return message;
        }
        }
    function removeSlackURL(){
      if(message.includes('|')){
        /* There may be a better way with the Slack API, but this will work
        returns URL as a string without extra formatting. Pre-formatted text appears like:
        <http://webbhost.net|webbhost.net> */
        var n = message.indexOf('|');
        var o = message.indexOf('>');
        var n = n+1;
        var o = o-2;
        var s1 = message.substr(n, o);
        var p = s1.indexOf('>');
        var s2 = s1.substr(0, p);
        console.log(s2);
        return s2;
      }
      else if(message.includes('http')){
        var endBracket = message.indexOf('>');
        var remBrackets = message.substr(1, endBracket-1);
        var indexOfSlash = message.indexOf('/');
        console.log(remBrackets);
        var remExt = remBrackets.substr(indexOfSlash+1, message.length);
        console.log(remExt);
        return remExt; 
      }
      else {
        console.log(message);
        console.log("else");
      }
    }
    if(message.includes(' dns')) {
        message = removeID(message);
        message = removeSlackURL(message);
        message = dnsLookup(message);
	} else if(message.includes(' whois')) {
        message = removeID(message)
        message = removeSlackURL(message);
		    message = whoisLookup(message);
	}
}



// Pull and serve DNS NS, A, CNAME, MX, TXT information
function dnsLookup(message) {
  function getNs() {
    return axios.get(dnsApi + '\/NS' + '\/'+ message);
  }
  function getA() {
    return axios.get(dnsApi + '\/A' + '\/'+ message);
  }
  function getCname() {
    return axios.get(dnsApi + '\/CNAME' + '\/'+ message);
  }
  function getMx() {
    return axios.get(dnsApi + '\/MX' + '\/'+ message);
  }
  function getTxt() {
    return axios.get(dnsApi + '\/TXT' + '\/'+ message);
  }

  axios.all([getNs(), getA(), getCname(), getMx(), getTxt()]).then(axios.spread(function (ns, a, cname, mx, txt){
    const params = {
      icon_emoji: ''
    };
    var data = [];
    data.ns = ns.data;
    data.a = a.data;
    data.cname = cname.data;
    data.mx = mx.data;
    data.txt = txt.data;

    for (var key in data){
      if (data.hasOwnProperty(key)) {
        console.log(JSON.stringify(data[key]));
        console.log(key + " -> " + JSON.stringify(data[key]));
        bot.postMessageToChannel(slackChannel, JSON.stringify(data[key], params))
      }
    }
  }))
}

// Pull and serve who.is data
function whoisLookup(message){
var url = "https://www.whoisxmlapi.com/"
    +"whoisserver/WhoisService?";
var parameters = {
		domainName: message,
		apiKey: process.env.WHOIS_API_KEY,
		outputFormat: 'json'
};
url = url + querystring.stringify(parameters);

https.get(url, function (res) {
    const statusCode = res.statusCode;

    if (statusCode !== 200) {
        console.log('Request failed: '
            + statusCode
        );
    }

    var rawData = '';

    res.on('data', function(chunk) {
        rawData += chunk;
    });
    res.on('end', function () {
        try {
            var parsedData = JSON.parse(rawData);
            if (parsedData.WhoisRecord) {
                bot.postMessageToChannel(slackChannel,'Domain name: '+ parsedData.WhoisRecord.domainName);
                bot.postMessageToChannel(slackChannel,'Contact email: '+ parsedData.WhoisRecord.contactEmail);
                bot.postMessageToChannel(slackChannel,'Created date: '+ parsedData.WhoisRecord.createdDate);
                bot.postMessageToChannel(slackChannel,'Updated date: '+ parsedData.WhoisRecord.updatedDate);
                bot.postMessageToChannel(slackChannel,'Expired date: '+ parsedData.WhoisRecord.expiresDate);
                bot.postMessageToChannel(slackChannel, parsedData.WhoisRecord.registrant.rawText);
                bot.postMessageToChannel(slackChannel, parsedData.WhoisRecord.administrativeContact.rawText);
                
            } else {
                console.log(parsedData);
            }
        } catch (e) {
            console.log(e.message);
        }
    })
}).on('error', function(e) {
    console.log("Error: " + e.message);
});

}