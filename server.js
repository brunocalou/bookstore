var express = require('express'),
    wine = require('./routes/books');
	logger = require('morgan'),
	http = require('http'),
	bodyParser = require('body-parser');;

var path = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger("combined"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

// app.listen(3000);
// console.log('Listening on port 3000...');

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});