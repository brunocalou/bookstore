angular.module('books').controller('booksCtrl', function($scope, $http) {
  $scope.books = [
    // {
    //     'id': '0',
    //     'title': 'O guia do mochileiro das galáxias',
    //     'author': 'Douglas Adams',
    //     'image': 'img/guia_mochileiro_1.jpg',
    //     'isbn': "000",
    //     'category': 'Fiction'
    // },
    // {
    //     'id': '1',
    //     'title': 'Praticamente inofensiva',
    //     'author': 'Douglas Adams',
    //     'image': 'img/guia_mochileiro_2.jpg',
    //     'isbn': "001",
    //     'category': 'Fiction'
    // },
    // {
    //     'id': '2',
    //     'title': 'O restaurante no fim do universo',
    //     'author': 'Douglas Adams',
    //     'image': 'img/guia_mochileiro_3.jpg',
    //     'isbn': "002",
    //     'category': 'Fiction'
    // },
    // {
    //     'id': '3',
    //     'title': 'A vida, o universo, e tudo mais',
    //     'author': 'Douglas Adams',
    //     'image': 'img/guia_mochileiro_4.jpg',
    //     'isbn': "003",
    //     'category': 'Fiction'
    // },
    // {
    //     'id': '4',
    //     'title': 'Até mais, e obrigado pelos peixes',
    //     'author': 'Douglas Adams',
    //     'image': 'img/guia_mochileiro_5.jpg',
    //     'isbn': "004",
    //     'category': 'Fiction'
    // },
    // {
    //     'id': '5',
    //     'title': 'Livro de teste',
    //     'author': 'Bruno Calou',
    //     'image': 'img/guia_mochileiro_5.jpg',
    //     'isbn': "005",
    //     'category': 'Fiction'
    // }
  ];

  $scope.categories = {
    'all': 0,
    'fiction': 0,
    'fantasy': 0,
    'humor': 0,
    'horror': 0
  };

  $scope.current_book;
  $scope.image_file;
  $scope.no_books_found = false;
  $scope.show_danger_zone = true;
  $scope.order = '_id';
  $scope.order_reverse = false;
  $scope.category = '';
  $scope.show_error_msg = false;
  $scope.error_msg = 'An error has occured';

  $scope.updateCategories = function(category) {
    var total_categorised_books = 0;

    $scope.category = category;

    //Reset the categories
    for (var category in $scope.categories) {
      $scope.categories[category] = 0;
    }

    $scope.categories.all = $scope.books.length;

    for (var i = 0; i < $scope.books.length; i++) {
      if ($scope.books[i].category == undefined) {
        continue;
      }
      for (var category in $scope.categories) {
        if (($scope.books[i].category).toLowerCase() == category) {
          $scope.categories[category] += 1;
          total_categorised_books += 1;
          continue;
        }
      }
    }

    $scope.category['others'] = $scope.category['all'] - total_categorised_books;
  };

  $scope.editBook = function(book) {
    var book_undefined = false;
    // console.log(book);
    if (book == undefined) {
      book = {
        'image': 'img/zoom-seach-icon.png'
      };
      book_undefined = true;
    }

    $scope.current_book = JSON.parse(JSON.stringify(book));

    if (!book_undefined) {
      $scope.show_danger_zone = true;
      $('#modal-save').removeAttr("disabled");
    } else {
      $scope.show_danger_zone = false;
      $('#modal-save').attr("disabled", "");

    }
    $scope.updateCategories($scope.category);
    $('#book-info-modal').modal('show');
  };

  $scope.openFileDialog = function() {
    document.getElementById('fileInput').click();
  };

  $scope.getImageFromDialog = function() {
    if ($scope.image_file && $scope.image_file[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $scope.current_book.image = e.target.result;

        //Apply the changes, since it was not made by angular
        $scope.$apply();
      }

      reader.readAsDataURL($scope.image_file[0]);
    }
  };

  $scope.fileNameChanged = function(file) {
    $scope.image_file = file.files;
    console.log($scope.image_file);
    $scope.getImageFromDialog();
  };

  $scope.save = function() {
    console.log("$scope.current_book._id " + $scope.current_book._id);
    if ($scope.current_book._id == undefined) {
      //Send the new book to the server and retrieve the new id
      $http.post('/books/', $scope.current_book).error(function(data, status) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.showError("Error " + status);
      }).success(function(data, status) {
        // The then function here is an opportunity to modify the response
        console.log(data);
        if (status == 200) {
          //If it was ok, add the book the the list
          $scope.books.push(data);
          $scope.updateBooksAndCloseModal();
        } else {
          console.log(response);
          $scope.showError("Error " + data.error);
        }
      });
    } else {
      $http.put("/books/" + $scope.current_book._id, $scope.current_book).error(function(data, status) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.showError("Error " + status);
      }).success(function(data, status) {
        // The then function here is an opportunity to modify the response
        console.log(data);
        if (status == 200) {
          //If it was ok, add the book the the list
          // $scope.books.push(response.data);
          for (var i = 0; i < $scope.books.length; i++) {
            var book = $scope.books[i];
            if (book._id == data._id) {
              $scope.books[i] = data;
              break;
            }
          }
          $scope.updateBooksAndCloseModal();
        } else {
          $scope.showError("Error " + data.error);
        }
      });
    }
  };

  $scope.delete = function() {
    //Send delete message to the server
    $http.delete("/books/" + $scope.current_book._id).error(function(data, status) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      $scope.showError("Error " + status);
    }).success(function(data, status) {
      if (data.ok && data.n) {
        //Delete book locally
        for (var i = 0; i < $scope.books.length; i++) {
          var book = $scope.books[i];
          if (book._id == $scope.current_book._id) {
            $scope.books.splice(i, 1);
            break;
          }
        }
        $scope.updateBooksAndCloseModal();
      } else {
        console.log(data);
        $scope.showError("Error " + data.error);
      }
    });
  };

  $scope.updateBooksAndCloseModal = function() {
    $scope.checkNumberOfBooks();
    $scope.updateCategories($scope.category);
    $('#book-info-modal').modal('hide');
    $scope.hideError();
  };

  $scope.checkNumberOfBooks = function() {
    if ($scope.books.length) {
      $scope.no_books_found = false;
    } else {
      $scope.no_books_found = true;
    }
  };

  $scope.hideError = function() {
    $scope.show_error_msg = false;
    $scope.error_msg = 'An error has occured';
  };

  $scope.showError = function(message) {
    $scope.show_error_msg = true;
    $scope.error_msg = message;
  };

  $('#book-info-modal').on('hidden.bs.modal', function() {
    $scope.hideError();
  });

  //Get all the books
  $http.get("/books/").success(function(data) {
    $scope.books = data;
    $scope.checkNumberOfBooks();
    $scope.updateCategories($scope.category);
  });

});
