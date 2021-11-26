const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const express = require('express');
const http = require('http');
const axios = require("axios");
const { json } = require('body-parser');
const app = express();
const httpServer = http.createServer(app);

//variables
let auth_token = null;
const baseUrl = 'https://webexapis.com/v1/';
const messagesBaseUrl = baseUrl + 'messages';
const roomId = 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL1JPT00vMzBmMDdlZjAtNGUxNS0xMWVjLWI4MGMtMTEyYzlkNzAzNTg3';

//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client-build')));


//Api for getting access_token if already logged in
app.get('/getAuthToken', (req, res) => {
  if (!auth_token) {
    res.status(404);
    res.json({ token: null })
  } else {
    res.status(200).json({ token: auth_token })
  }
});

//Api to remove token from server
app.post('/logout', (req, res) => {
  auth_token = null;
  res.json({ ok: true });
});

//Api to get own details
app.get('/ownDetails', (req, res) => {
  const url = baseUrl + 'people/me';
  axios.get(url, { headers: { "Authorization": req.headers.authorization } }).then(response => {
    if (response.status === 200) {
      res.status(200).json(response.data);
    }
  }).catch(err => {
    console.log("Error making the request");
    res.status(404).json(err);
  });
});

//Api to get messages list
app.get('/messagesList', (req, res) => {
  auth_token = req.headers.authorization;
  const url = messagesBaseUrl + '?roomId=' + roomId;
  const headers = { headers: { "Authorization": req.headers.authorization } };
  axios.get(url, headers).then(response => {
    if (response.status === 200) {
      res.status(200).json(response.data);
    }
  }).catch(err => {
    console.log("Error making the request");
    res.status(500).json(err);
  });
});

//Api to get message details of a particular message
app.get('/messageDetails/:messageId', (req, res) => {
  const url = messagesBaseUrl + '/' + req.params.messageId;
  const headers = {
    'Authorization': req.headers.authorization
  };
  axios.get(url, { headers }).then(response => {
    if (response.status === 200) {
      res.status(200).json(response.data);
    }
  }).catch(err => {
    console.log("Error making the request");
    res.status(500).json(err);
  });
});

//Api to create a new message
app.post('/createMessage', (req, res) => {
  const url = messagesBaseUrl;
  const headers = {
    'Authorization': req.headers.authorization
  };
  const body = {
    roomId: roomId,
    text: req.body.text
  };

  axios.post(url, body, { headers }).then(response => {
    if (response.status === 200) {
      res.status(200).json(response.data);
    }
  }).catch(err => {
    console.log("Error making the request");
    res.status(500).json(err);
  });
});

//Api to delete a message
app.delete('/deleteMessage/:messageId', (req, res) => {
  const url = messagesBaseUrl + '/' + req.params.messageId;
  const headers = {
    'Authorization': req.headers.authorization
  };

  axios.delete(url, { headers }).then(response => {
    if (response.status === 204) {
      res.status(204).json(response.data);
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//Render UI of Webex Messages
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client-build') + '/index.html');
});

//Server started
httpServer.listen(4200);

console.log('Server is running at 4200');