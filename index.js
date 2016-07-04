"use strict";
(function() {
  "use strict"; 
  
})(); 

//start wit code
//wit initialization
let Wit = null;
let log = null;
//try {
  // if running from repo
  //Wit = require('../').Wit;
//} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
//}
const WIT_TOKEN = 'DESJT5X6GQDTE7UPHRRMYX6ULEENBDHS';


//wit actions
// Our bot actions

const fbMessage = (id, text) => {
  const body = JSON.stringify({
    recipient: { id },
    message: { text },
  });
  const qs = 'access_token=' + encodeURIComponent('EAAXA84xheSUBAJmAT8hcrz5jtoN0jvZBhgcynY4ZBD0W8r6IA4aZBeaqKs4eKe9tXUdd4NaTbbBGeIkTeoZBWG6lBPuayvS2CkbtR5MkzXZBQtyxEEsFSUJQaGXmVGuvWEbzbZAYaKzsGGYKEFiZCuhsxoyjVpFQnZCnpMKZCZBv2tLQHNfCeIfA5B');
  return fetch('https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
  })
  .then(rsp => rsp.json())
  .then(json => {
    if (json.error && json.error.message) {
      throw new Error(json.error.message);
    }
    console.log('printing json in fbmessage', json);
    return json;
  });
};
/*const actions = {
  send({sessionId}, {text}) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return fbMessage(recipientId, text)
      .then(() => null)
      .catch((err) => {
        console.error(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err.stack || err
        );
      });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }
  },
  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};*/
const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
     // return resolve();
     const recipientId = sessions[sessionId].fbid;
     sendMessage(recipientId,JSON.stringify(response) );
    });
  },
  getForecast({context, entities}) {
    return new Promise(function(resolve, reject) {
      var location = firstEntityValue(entities, 'wit_location')
      console.log('printing location', location);
      //location = 'rome';
      if (location=='rome') {
        context.forecast = 'sunny in ' + location; // we should call a weather API here
        delete context.missingLocation;
      } else if (location=='paris') {
        context.forecast = 'rainy in ' + location; // we should call a weather API here
        delete context.missingLocation;
      } else {
        context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
      
    });
  },
};

const firstEntityValue = (entities, entity) => {
  console.log('printing entities', entities);
  console.log('printing entity', entity);
  console.log('printing entities[entity]', entities[entity]);
  const bool = entities[entity];
  
   console.log('printing entities[entity] bool', bool);
    console.log('printing entities[entity] 0', entities[entity][0].value);
     //console.log('printing entities[entity] 2', entities[entity][2].value);
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  console.log('inside first entiry value before ret null', val);
  if (!val) {
    console.log('too bad ret null', val);
    return null;
  }
  console.log('got some val', val);
  return typeof val === 'object' ? val.value : val;
};

//init wit class
// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});
//end wit code

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'test_my_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};
// handler receiving messages
/*app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    var i;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            if (!kittenMessage(event.sender.id, event.message.text)) {
                sendMessage(event.sender.id, {text: "Chatty: " + event.message.text});
            }
        } else if (event.postback) {
            console.log("Postback received: " + JSON.stringify(event.postback));
        }
    }
    res.sendStatus(200);
});*/

// Message handler
app.post('/webhook', (req, res) => {
  // Parse the Messenger payload
  // See the Webhook reference
  // https://developers.facebook.com/docs/messenger-platform/webhook-reference
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message) {
          // Yay! We got a new message!
          // We retrieve the Facebook user ID of the sender
          const sender = event.sender.id;

          // We retrieve the user's current session, or create one if it doesn't exist
          // This is needed for our bot to figure out the conversation history
          const sessionId = findOrCreateSession(sender);

          // We retrieve the message content
          const {text, attachments} = event.message;

          if (attachments) {
            // We received an attachment
            // Let's reply with an automatic message
            fbMessage(sender, 'Sorry I can only process text messages for now.')
            .catch(console.error);
          } else if (text) {
            // We received a text message

            // Let's forward the message to the Wit.ai Bot Engine
            // This will run all actions until our bot has nothing left to do
            console.log('this is the message i typed', text);
            wit.runActions(
              sessionId, // the user's current session
              text, // the user's message
              sessions[sessionId].context // the user's current session state
            ).then((context) => {
              // Our bot did everything it has to do.
              // Now it's waiting for further messages to proceed.
              console.log('Waiting for next user messages');

              // Based on the session state, you might want to reset the session.
              // This depends heavily on the business logic of your bot.
              // Example:
              // if (context['done']) {
              //   delete sessions[sessionId];
              // }

              // Updating the user's current session state
              sessions[sessionId].context = context;
            })
            .catch((err) => {
              console.error('Oops! Got an error from Wit: ', err.stack || err);
            })
          }
        } else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
  }
  res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: 'EAAXA84xheSUBAJmAT8hcrz5jtoN0jvZBhgcynY4ZBD0W8r6IA4aZBeaqKs4eKe9tXUdd4NaTbbBGeIkTeoZBWG6lBPuayvS2CkbtR5MkzXZBQtyxEEsFSUJQaGXmVGuvWEbzbZAYaKzsGGYKEFiZCuhsxoyjVpFQnZCnpMKZCZBv2tLQHNfCeIfA5B'},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split(' ');
    
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        }
    }
    
    return false;
    
};
