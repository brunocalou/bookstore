angular.module('books').factory('booksAPI', function($http, config) {
  var _getBooks = function() {
    return $http.get(config.baseURL + '/books/');
  };

  var _getBook = function(book) {
    return $http.get(config.baseURL + '/books/' + book._id);
  };

  var _addBook = function(book) {
    return $http.post(config.baseURL + '/books/', book);
  };

  var _updateBook = function(book) {
    return $http.put(config.baseURL + '/books/' + book._id, book);
  };

  var _deleteBook = function(book) {
    return $http.delete(config.baseURL + '/books/' + book._id);
  };

  return {
    getBooks: _getBooks,
    getBook: _getBook,
    addBook: _addBook,
    updateBook: _updateBook,
    deleteBook: _deleteBook
  };
});
