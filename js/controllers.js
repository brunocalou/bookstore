var booksApp = angular.module('app', []);

booksApp.controller('BooksCtrl', function ($scope) {
    $scope.books = [
        {
            'id': '0',
            'title': 'O guia do mochileiro das galáxias',
            'author': 'Douglas Adams',
            'image': 'img/guia_mochileiro_1.jpg',
            'isbn': "123",
            'category': 'Fiction'
        },
        {
            'id': '1',
            'title': 'Praticamente inofensiva',
            'author': 'Douglas Adams',
            'image': 'img/guia_mochileiro_2.jpg',
            'isbn': "123",
            'category': 'Fiction'
        },
        {
            'id': '2',
            'title': 'O restaurante no fim do universo',
            'author': 'Douglas Adams',
            'image': 'img/guia_mochileiro_3.jpg',
            'isbn': "123",
            'category': 'Fiction'
        },
        {
            'id': '3',
            'title': 'A vida, o universo, e tudo mais',
            'author': 'Douglas Adams',
            'image': 'img/guia_mochileiro_4.jpg',
            'isbn': "123",
            'category': 'Fiction'
        },
        {
            'id': '4',
            'title': 'Até mais, e obrigado pelos peixes',
            'author': 'Douglas Adams',
            'image': 'img/guia_mochileiro_5.jpg',
            'isbn': "123",
            'category': 'Fiction'
        },
        {
            'id': '5',
            'title': 'Livro de teste',
            'author': 'Bruno Calou',
            'image': 'img/guia_mochileiro_5.jpg',
            'isbn': "123",
            'category': 'Fiction'
        }
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
    $scope.test_id = -1;
    $scope.no_books_found = false;
    $scope.show_danger_zone = true;

    $scope.updateCategories = function() {
        console.log("updating categories");
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
        console.log("$scope.current_book.id " + $scope.current_book.id);
        if($scope.current_book.id == undefined) {
            //Send the new book to the server and retrieve the new id
            console.log("undefined");
            var new_book = JSON.parse(JSON.stringify($scope.current_book));
            new_book.id = $scope.test_id;
            $scope.test_id -= 1;
            
            $scope.books.push(new_book);
            
        } else {
            //Send the book info to the server
            
            //Change the book info locally
            for(var i = 0; i < $scope.books.length; i++) {
                var book = $scope.books[i];
                if(book.id == $scope.current_book.id) {
                    $scope.books[i] = JSON.parse(JSON.stringify($scope.current_book));
                    break;
                }
            }
        }
        checkNumberOfBooks();
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
        
        //Delete book locally
        for(var i = 0; i < $scope.books.length; i++) {
            var book = $scope.books[i];
            if(book.id == $scope.current_book.id) {
                $scope.books.splice(i, 1);
//                $scope.books[i] = JSON.parse(JSON.stringify($scope.current_book));
                break;
            }
        }
        
        checkNumberOfBooks();
        $('#book-info-modal').modal('hide');
    };
    
    var checkNumberOfBooks = function() {
        console.log($scope.books.length);
        if($scope.books.length) {
            $scope.no_books_found = false;
        } else {
            $scope.no_books_found = true;
        }
    }
});