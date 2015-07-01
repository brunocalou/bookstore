var express = require('express'),
  book = require('./routes/books'),
  logger = require('morgan'),
  http = require('http'),
  bodyParser = require('body-parser');

var path = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger("combined"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json({
  limit: '1mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/books', book.findAll);
app.get('/books/:id', book.findById);
app.post('/books', book.addbook);
app.put('/books/:id', book.updatebook);
app.delete('/books/:id', book.deletebook);

// app.listen(3000);
// console.log('Listening on port 3000...');

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
