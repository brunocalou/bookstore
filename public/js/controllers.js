var booksApp = angular.module('app', ['ngResource']);

booksApp.controller('BooksCtrl', function ($scope, $http, Book) {
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
        'terror': 0
    };
    
    $scope.current_book;
    $scope.image_file;
    $scope.no_books_found = false;
    $scope.show_danger_zone = true;
    $scope.order = '_id';
    $scope.order_reverse = 'false';
    $scope.category = '';

    $scope.updateCategories = function(category) {
        $scope.category = category;
        
        //Reset the categories
        for(var category in $scope.categories) {
            $scope.categories[category] = 0;
        }
        
        $scope.categories.all = $scope.books.length;
        
        for(var i = 0; i < $scope.books.length; i++) {
            if($scope.books[i].category == undefined) {
                continue;
            }
            for(var category in $scope.categories) {
                if(($scope.books[i].category).toLowerCase() == category) {
                    $scope.categories[category] += 1;
                    continue;
                }
            }        
        }
    };
    
    $scope.editBook = function(book) {
        var book_undefined = false;
        console.log(book);
        if(book == undefined) {
            book = {'image':'img/zoom-seach-icon.png'};
            book_undefined = true;
        }
        
        $scope.current_book = JSON.parse(JSON.stringify(book));

        if(!book_undefined) {
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

            reader.onload = function (e) {
//                $('#book-form-cover img').attr('src', e.target.result);
                $scope.current_book.image = e.target.result;
                
                //Apply the changes, since it was not made by angular
                $scope.$apply();
                
//                console.log($scope.current_book.image);
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
        if($scope.current_book._id == undefined) {
            //Send the new book to the server and retrieve the new id
            // Book.save($scope.current_book);
            var config = {
                method: "POST",
                url: "/books/",
                data: $scope.current_book,
                headers: {"Content-Type": "application/json;charset=utf-8"}
            };
            $http(config).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                if(response.status == 200) {
                    //If it was ok, add the book the the list
                    $scope.books.push(response.data);
                }
                
            });
            
        } else {
            var config = {
                method: "PUT",
                url: "/books/" + $scope.current_book._id,
                data: $scope.current_book,
                headers: {"Content-Type": "application/json;charset=utf-8"}
                // headers: {"Content-Type": "application/json;charset=utf-8"}
            };
            $http(config).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                if(response.status == 200) {
                    //If it was ok, add the book the the list
                    // $scope.books.push(response.data);
                    for(var i = 0; i < $scope.books.length; i++) {
                        var book = $scope.books[i];
                        if(book._id == response.data._id) {
                            $scope.books[i] = response.data;
                            break;
                        }
                    }
                }
            });
        }
        $scope.checkNumberOfBooks();
        $scope.updateCategories($scope.category);
        $('#book-info-modal').modal('hide');
    };
    
    $scope.verifyBookInfo = function() {
        console.log($("#book-title").val());
        if($("#book-title").val() != '' &&
          $("#book-author").val() != '' &&
          $("#book-category").val() != '' &&
          $("#book-isbn").val() != '') {
            $('#modal-save').removeAttr("disabled");
        } else {
            $('#modal-save').attr("disabled", "");
        }
    };
    
    $scope.delete = function() {
        //Send delete message to the server
        console.log("deleting " + $scope.current_book._id);
        var config = {
            method: "DELETE",
            url: "/books/" + $scope.current_book._id,
            headers: {"Content-Type": "application/json;charset=utf-8"}
        };
        $http(config).then(function (response) {
            if(response.data.ok && response.data.n) {
                //Delete book locally
                for(var i = 0; i < $scope.books.length; i++) {
                    var book = $scope.books[i];
                    if(book._id == $scope.current_book._id) {
                        $scope.books.splice(i, 1);
                        break;
                    }
                }
            }
        });

        
        
        $scope.checkNumberOfBooks();
        $scope.updateCategories($scope.category);
        $('#book-info-modal').modal('hide');
    };
    
//    $scope.order = function(predicate) {
////        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
//        console.log(preditate);
//        $scope.predicate = predicate;
//    };
    
    $scope.checkNumberOfBooks = function() {
        console.log($scope.books.length);
        if($scope.books.length) {
            $scope.no_books_found = false;
        } else {
            $scope.no_books_found = true;
        }
    }

    Book.query(function(data) {
        console.log(data);
        $scope.books = data;
        $scope.checkNumberOfBooks();
        $scope.updateCategories($scope.category);
  });
});

booksApp.factory("Book", function($resource) {
  return $resource("/books/:id");
});

// booksApp.controller("BooksCtrl", function($scope, Post) {
//   Post.query(function(data) {
//       console.log(data);
//     $scope.books = data;
//     $scope.checkNumberOfBooks();
//     $scope.updateCategories($scope.category);
//   });
//   // Post.get({ id: 1 }, function(data) {
//   //     console.log(data);
//   //   $scope.books = data;
//   // });
// });
