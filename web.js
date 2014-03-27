var express = require("express");
var logfmt = require("logfmt");
var app = express();
app.use(logfmt.requestLogger());


app.get('/', function(req, res) {
  res.sendfile('/usr/index.html', {root:__dirname});
});
app.get('/paper.js', function(req, res) {
  res.sendfile('/usr/paper-core.min.js', {root:__dirname});
});
app.get('/cc.js', function(req, res) {
  res.sendfile('/usr/cc.js', {root:__dirname});
});
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

