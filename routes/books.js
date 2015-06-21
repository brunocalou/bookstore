var mongo = require('mongodb'),
    ObjectId = require('mongodb').ObjectID;
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('bookdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'bookdb' database");
        db.collection('books', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'books' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = {'_id': new ObjectId(req.params.id)};
    console.log('Retrieving book: ' + req.params.id);
    db.collection('books', function(err, collection) {
        collection.findOne(id, function(err, item) {
            if(err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('books', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addbook = function(req, res) {
    var book = req.body;
    console.log('Adding book: ' + JSON.stringify(book));
    db.collection('books', function(err, collection) {
        collection.insert(book, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updatebook = function(req, res) {
    var id = req.params.id;
    var book = req.body;
    console.log('Updating book: ' + id);
    console.log(JSON.stringify(book));
    db.collection('books', function(err, collection) {
        collection.update({'_id':new ObjectId(req.params.id)}, book, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating book: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(book);
            }
        });
    });
}
 
exports.deletebook = function(req, res) {
    var id = req.params.id;
    console.log('Deleting book: ' + id);
    db.collection('books', function(err, collection) {
        collection.remove({'_id':new ObjectId(req.params.id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var books = [
    {
        'title': 'O guia do mochileiro das galáxias',
        'author': 'Douglas Adams',
        'image': 'img/guia_mochileiro_1.jpg',
        'isbn': "000",
        'category': 'Fiction'
    },
    {
        'title': 'Praticamente inofensiva',
        'author': 'Douglas Adams',
        'image': 'img/guia_mochileiro_2.jpg',
        'isbn': "001",
        'category': 'Fiction'
    },
    {
        'title': 'O restaurante no fim do universo',
        'author': 'Douglas Adams',
        'image': 'img/guia_mochileiro_3.jpg',
        'isbn': "002",
        'category': 'Fiction'
    },
    {
        'title': 'A vida, o universo, e tudo mais',
        'author': 'Douglas Adams',
        'image': 'img/guia_mochileiro_4.jpg',
        'isbn': "003",
        'category': 'Fiction'
    },
    {
        'title': 'Até mais, e obrigado pelos peixes',
        'author': 'Douglas Adams',
        'image': 'img/guia_mochileiro_5.jpg',
        'isbn': "004",
        'category': 'Fiction'
    }];
 
    db.collection('books', function(err, collection) {
        collection.insert(books, {safe:true}, function(err, result) {});
    });
 
};
