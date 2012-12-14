var path = require('path');
var fs = require('fs');
var http = require('http');
var express = require('express');

var app = express();

app.set('port', process.env.PORT || 8000);
app.set('views', path.resolve(__dirname, '../application'));
app.set('view engine', 'html');

app.engine('html', function (path, options, fn) {
  if ('function' == typeof options) {
    fn = options, options = {};
  }
  fs.readFile(path, 'utf8', fn);
});

app.use(express.favicon());
app.use(express.bodyParser());

app.use(express.logger('dev'));
app.use(express.static(path.resolve(__dirname, '../application')));
app.use(function (req, res) {
  res.render('index.html', { layout: null });
});
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});