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

const dnsApi = 'https://dns-api.org/';

// Start Handler
bot.on('start', () => {
	const params = {
	icon_emoji: ':linkms:'
	};

	bot.postMessageToChannel('bot-testing', "Don't panic", params);
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
    function removeID(message) {
        // Use Node Buffer to remove ID
        var buf1 = Buffer.allocUnsafe(26);
        buf1 = message;
        buf2 = buf1.slice(13, buf1.length);
        return buf2.toString('ascii', 0, buf2.length);
        }
    function removeSlackURL(message){
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
      else if(message.includes(' https')){
        var remBrackets = message.substr(1, message.length-1);
        var remExt = remBrackets.substr(9, mesage.length);
        return remExt;
      }
      else if(message.includes(' http')){
        var remBrackets = message.substr(1, message.length-1);
        var remExt = remBrackets.substr(8, mesage.length);
        return remExt;
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
    
  
  function postNS() {
    axios.get(dnsApi + '\/NS' + '\/'+ message)
      .then(function (response) {
      // handle success
          const params = {
            icon_emoji: ''
          };
          bot.postMessageToChannel('bot-testing', response.data, params);
      })
      .catch(function (error) {
      // handle error
      console.log(error);
      })
      .then(function () {
      // always executed
  });
  }
  function postA() {
    axios.get(dnsApi + '\/A' + '\/'+ message)
      .then(function (response) {
        const params = {
          icon_emoji: ''
        };
        bot.postMessageToChannel('bot-testing', response.data, params);
      })
      .catch(function (error) {
      console.log(error);
      })
      .then(function () {
});
}
  function postCNAME() {
    axios.get(dnsApi + '\/CNAME' + '\/'+ message)
      .then(function (response) {
        const params = {
          icon_emoji: ''
        };
        bot.postMessageToChannel('bot-testing', response.data, params);
     })
      .catch(function (error) {
      console.log(error);
      })
      .then(function () {
});
}
  function postMX() {
    axios.get(dnsApi + '\/MX' + '\/'+ message)
      .then(function (response) {
        const params = {
          icon_emoji: ''
        };
        bot.postMessageToChannel('bot-testing', response.data, params);
      })
      .catch(function (error) {
      console.log(error);
     })
      .then(function () {
});
}
function postTXT() {
  axios.get(dnsApi + '\/TXT' + '\/'+ message)
    .then(function (response) {
         const params = {
           icon_emoji: ''
         };
      bot.postMessageToChannel('bot-testing', response.data, params);
    })
    .catch(function (error) {
    console.log(error);
      })
      .then(function () {
  });
}
      postNS(message);
      postA(message);
      postCNAME(message);
      postMX(message);
      postTXT(message);
  
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
                bot.postMessageToChannel('bot-testing','Domain name: '+ parsedData.WhoisRecord.domainName);
                bot.postMessageToChannel('bot-testing','Contact email: '+ parsedData.WhoisRecord.contactEmail);
                bot.postMessageToChannel('bot-testing','Created date: '+ parsedData.WhoisRecord.createdDate);
                bot.postMessageToChannel('bot-testing','Updated date: '+ parsedData.WhoisRecord.updatedDate);
                bot.postMessageToChannel('bot-testing','Expired date: '+ parsedData.WhoisRecord.expiresDate);
                bot.postMessageToChannel('bot-testing', parsedData.WhoisRecord.registrant.rawText);
                bot.postMessageToChannel('bot-testing', parsedData.WhoisRecord.administrativeContact.rawText);
                
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