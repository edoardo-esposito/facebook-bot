var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

var fb_page_token = "CAADOMHoG70YBAIulwTUWmB5QUv430Kfg0CUIEAD8TZBSStRAUpoEPLuDz58rrUbR87bSMIEDlOBP1VyBZBEazTj9ZBnXaVxaWMpkeT8DddoCZBCZBhAO7QKcODBjihZA1juhaveaDa7rgREzLyrZCddZBucSZBwjfTbcwNRl9wsa4dcWNZCrZAL1zBXNk7d8UE1vGwZD";
var fb_verify_token = "jsfkfiwnfiwfwf283712";

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    console.log('Hello world, I am a chat bot')
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === fb_verify_token) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
	messaging_events = req.body.entry[0].messaging
	console.log(messaging_events);
	for (i = 0; i < messaging_events.length; i++) {
	    event = req.body.entry[0].messaging[i]
	    sender = event.sender.id;

	    if (event.message && event.message.text) {
	    	text = event.message.text
		console.log("Text: " + text);
	        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
	    }
    }
    res.sendStatus(200)
})

var token = fb_page_token;

function sendTextMessage(sender, text) {
	messageData = {
		text:text
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		console.log(body);
		console.log(response);

		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
