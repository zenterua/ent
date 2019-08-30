var history = require('connect-history-api-fallback')
var express = require('express');
const http = require('http');
const path = require('path');

var app = express();
const port= process.env.PORT || 3001;
console.log(__dirname);

app.get('/', (req, res) => {
  res.status(200).set('Content-Type', 'text/plain').send('ok');
});

app.use(function (req, res, next) {
  var url = req.url;
  var originalURL = req.originalUrl;
    console.log(url + " " + originalURL);
  next();
});

app.use(express.static(__dirname));
app.use("/portal",express.static(__dirname+"/en"));
app.use("/portal/en",express.static(__dirname+"/en"));
app.use("/portal/fr",express.static(__dirname+"/fr"));
app.use("/portal/en/*",express.static(__dirname+"/en"));
app.use("/portal/fr/*",express.static(__dirname+"/fr"));
app.use("/portal/en/auth/login",express.static(__dirname+"/en"));
app.use("/portal/fr/auth/login",express.static(__dirname+"/fr"));

const server=http.createServer(app);
server.listen(port, ()=> console.log('Running...'));
