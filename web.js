var express = require("express");
var logfmt = require("logfmt");
var app = express();
app.use(logfmt.requestLogger());


app.get('/', function(req, res) {
  res.sendfile('/usr/index.html', {root:__dirname});
});
app.get('/usr/paper-core.min.js', function(req, res) {
  res.sendfile('/usr/paper-core.min.js', {root:__dirname});
});
app.get('/usr/jcanvas.js', function(req, res) {
  res.sendfile('/usr/jcanvas.js', {root:__dirname});
});
app.get('/usr/script.js', function(req, res) {
  res.sendfile('/usr/script.js', {root:__dirname});
});
app.get('/usr/style.css', function(req, res) {
  res.sendfile('/usr/style.css', {root:__dirname});
});
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

