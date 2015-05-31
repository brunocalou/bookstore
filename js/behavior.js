function getBook(book_id) {
    var search_img = 'img/zoom-seach-icon.png';
    
    console.log(book_id);
    
    if(book_id != undefined) {
        console.log("Requesting book from the server");
        $('#modal-danger-zone').show();
    } else {
        $('#book-form-cover img').attr('src', search_img);
        $('#modal-danger-zone').hide();
        console.log("hide danger zone");
    }
    $('#book-info-modal').modal('show');
};

function getListOfBooks() {
    var key = $( "#search-bar input" );
    
    console.log("Retrieving list... " + $( "#search-bar input" ).val());
};

$(document).ready(function(){
    $( "#book-list button" ).click(function() {
        var
            id = $(this).attr('book-id'),
            cover = $(this).find('img').attr('src');
        
        $('#book-form-cover img').attr('src', cover);
        getBook(id);
    });
    
    $( "#search-bar input" ).keyup(getListOfBooks);
});

//TESTAR - SERVE PARA TROCAR A IMAGEM DO BOTAO DE INPUT
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#book-form-cover img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
};

    $("#book-form-cover img").change(function(){
    readURL(this);
});

function onLoad() {
    document.getElementById('fileInput').click();
}

function handleFiles(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = onFileReadComplete;
    reader.readAsText(file);
}
  
function onFileReadComplete(event) { 
  // Do something fun with your file contents.
}