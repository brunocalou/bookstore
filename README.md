# bookstore
Project for the Distributed Systems class at UFRJ

It's hosted at https://meanbookstore.herokuapp.com/

## Build and run
### Prerequisites
* [Nodejs](https://nodejs.org/)

After installing the prerequisites, open the terminal and follow the steps:
```bash
> cd <my project folder>
> node server.js
```
Open your browser and go to localhost:3000


### Local database
If you want to use a local database, install the [Mongodb](https://www.mongodb.org/), open the terminal and follow the steps

```bash
> cd <your database location>
> mkdir data
> mongod --dbpath data
```
Keep the terminal working and open another one
```bash
> mongo
> use bookdb
> exit
```

Go to <your project folder>/routes/books.js, comment the connect line and uncomment the next line, like this
```javascript
// MongoClient.connect('mongodb://test:test@ds061721.mongolab.com:61721/heroku_gt4wxlmn', function(err, database) {
MongoClient.connect('mongodb://localhost:27017/bookdb', function(err, get_db) {
```
After that, run the server
