// Get the modal
var modalFAQ = document.getElementById("faqModal");

$('#faqButton').click(function(){
    $('#faqModal').show();
})

$('#closeFAQ').click(function(){
    $('#faqModal').hide();
})



$('#list').click(function(e){
  let id = parseInt(e.target.id);
  const array = ['This site is 100% secured and dosent save your private data or information',
'Press the Login button from home page',
'Just register or press "Verify Email" button while login',
'Click on "Select Location or Mosque" option, then click "Select Location"',
'Press the Audio Icon when its green. If its white, then the audio is already disabled'
];
$('.answer').text(array[id])
})