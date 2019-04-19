const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();
app.use(express.static(path.join(__dirname, 'baomoi-admin/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
import Expo from 'expo-server-sdk';
function sendNoti(title, body, tokens) {
    // Create a new Expo SDK client
    let expo = new Expo();
    // Create the messages that you want to send to clents
    const tokensSend = [...tokens]
    let messages = [];
    for (let pushToken of tokensSend) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        // messages.push({
        //     to: pushToken,
        //     sound: 'default',
        //     title: this.state.title,
        //     body: this.state.body,
        //     data: {
        //         postID: this.state.postID,
        //         title: this.state.title,
        //         body: this.state.body,
        //     }
        // })
        messages.push({
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            data: {
                title: title,
                body: body,
            }
        })
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
          console.error(error);
        }
      }
    })();
}


app.post("/api/test", (req, res) => {
    sendNoti(req.body.title, req.body.body, req.body.tokens);
    res.json("done")
})

app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/baomoi-admin/build/index.html'));
});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
