// Get the modal
var modalContact = document.getElementById("contactModal");

$('#contactUS').click(function(){
    $('#contactModal').show();
})

$('#closeContact').click(function(){
    $('#contactModal').hide();
})

// When the user clicks anywhere outside of the modal, close it
