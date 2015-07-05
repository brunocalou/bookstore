angular.module('books').filter('findbooks', function(stringNormalizer) {

  return function(books, text, category) {
    if (books.length == 0) {
      return books;
    }

    if (text == undefined) {
      text = '';
    } else {
      text = stringNormalizer.removeDiacritics(text.toLowerCase());
    }

    if (category == undefined) {
      category = '';
    } else {
      category = stringNormalizer.removeDiacritics(category.toLowerCase());
    }

    var filtered_books = [];

    for (var i = 0; i < books.length; i++) {
      var book = books[i],
        book_title = stringNormalizer.removeDiacritics(book.title.toLowerCase()),
        book_author = stringNormalizer.removeDiacritics(book.author.toLowerCase()),
        book_category = book.category.toLowerCase();

      if (book_category == category || category == '') {
        if (book_title.indexOf(text) > -1 || book_author.indexOf(text) > -1 || text == '') {
          filtered_books.push(book);
        }
      }
    }
    return filtered_books;
  }
});
