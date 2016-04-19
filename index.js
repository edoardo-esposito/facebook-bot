var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

var fb_page_token = "CAADOMHoG70YBAJzbsoIRZAExczO6degnyMSCfriL1s5M234LynybVcal4tpJcus2TZAZCMEnqAbKC41g74Iprhlul4zz4qrtI6qsraL6H2COmDk04aoxR7WZAmnPZCFynLvv7JBGmddaUILN8Lv6NXjYbL13nmmZAkakQXpFeHW49iQTm9T3iMj4NhZBo2YnCoZD";

var fb_verify_token = "jsfkfiwnfiwfwf283712";

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Chat bot')
})

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === fb_verify_token) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
	messaging_events = req.body.entry[0].messaging
	for (i = 0; i < messaging_events.length; i++) {
	    event = req.body.entry[0].messaging[i]
	    sender = event.sender.id;

	    if (event.message && event.message.text) {
	    	text = event.message.text
		console.log("Text: " + text);
	
	            if (text === 'volantino') {
	                sendFlyers(sender)
	                continue
	            }

	        sendTextMessage(sender, "Hai scritto: " + text.substring(0, 200))
	    }
    }
    res.sendStatus(200)
})

var token = fb_page_token;

function sendTextMessage(sender, text) {
	messageData = {
		text:text
	}

	console.log("Sender: " + sender);

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {

		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendFlyers(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Mediaworld",
                    "subtitle": "Che la forza sia con te",
                    "image_url": "http://www.doveconviene.it/images/volantini/big_285498.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.doveconviene.it/viewer/285498/1/cernusco-sul-naviglio",
                        "title": "Sfoglia il volantino"
                    }],
                }, {
                    "title": "Sky",
                    "subtitle": "Offerte Sky & Fastweb",
                    "image_url": "http://www.doveconviene.it/images/volantini/big_286833.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.doveconviene.it/viewer/286833/1/cernusco-sul-naviglio",
                        "title": "Sfoglia il volantino"
                    }],
                }]
            }
        }
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
