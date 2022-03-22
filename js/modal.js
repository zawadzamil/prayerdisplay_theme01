
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const locationDiv = document.getElementById('locationDiv');
const mosqueDiv = document.getElementById('mosqueDiv');
const locationCheck = document.getElementById('locationCheck');
const mosqueCheck = document.getElementById('mosqueCheck');

locationCheck.addEventListener('change',function (event) {
    if(event.currentTarget.checked){
        console.log('Checked Location!')
        mosqueCheck.checked = false
        locationDiv.style.display = 'block'
        mosqueDiv.style.display = 'none'

    }
    });
    mosqueCheck.addEventListener('change',function (event) {
        if(event.currentTarget.checked){
            console.log('Checked Mosque!')
            locationCheck.checked = false
            locationDiv.style.display = 'none'
            mosqueDiv.style.display = 'block'

        }
    });

const selectCountry = document.getElementById('country');
const selectCountryM = document.getElementById('countryM');
const selectCity = document.getElementById('city');
const selectMosque = document.getElementById('mosque');

    //Fetching Country Data
    fetch('https://admin.prayerdisplay.com/api/getCountry')
    .then(response =>response.json())
    .then(json => getCountries(json));

function getCountries(data){
// Adding Countries 
    data.forEach(element => {
        let option = document.createElement('option');
        option.value = element.id;
        option.text = element.name;
        selectCountry.appendChild(option);
        
        
    });
}
$(document).ready(function () {
    $('#country').on('change', function () {
        var countryId = this.value;

        $('#city').html('');
        $.ajax({
            url: 'https://admin.prayerdisplay.com/api/getCity?country_id='+countryId,
            type: 'get',
            success: function (res) {
                $('#city').html('<option value="">Select City</option>');
                console.log("Getting");
                $.each(res, function (key, value) {

                    $('#city').append('<option value="' + value
                        .id + '">' + value.name + '</option>');
                });
            }
        });
    });

    


});

$('#loc-sub-button').click(function(){
    const cityId = selectCity.value;
    $('#jamat').hide();
    $('#adhan').hide();
    $('#start').hide();
    $('#prayer').show();
    $('#marquee').empty();

    document.getElementById('marquee').innerHTML = ` <span>Do not despair of the mercy of Allah. Quran 39:53**</span>
    <span>Do they not see the birds controlled in the atmosphere of the sky? none holds them up except Allah. Indeed in that are signs for a people who believe. – Quran (16:79)**</span>
   <span>So be patient. Indeed, the promise of ALLAH is truth – Quran 30:60**</span>
   <span>And for those who fear Allah, he will make their path easy – Quran – Al talak: 4**</span>`;

    if(cityId=='') alert('Please Select Country and City');
    else{
        $('#compassDiv').show();
        $('.imageSlider').hide();
        $.ajax({
            url: 'https://admin.prayerdisplay.com/api/getSingleCity?id='+cityId,
            type: 'get',
            success: function (res) {
               
                const data = JSON.parse(res);
                const city = data.city;
                const country = data.country;
                fetch('https://api.aladhan.com/v1/calendarByCity?city='+city+'&country='+country+'&method=1&month='+mm+'&year='+yyyy+' ')
       .then(response => response.json())
       .then(json =>saveToArray(json));
       modal.style.display = "none";
       locationText.innerText = city +', '+country;
                
    
            }
            
        });

    }
    
    

    
});

fetch('https://admin.prayerdisplay.com/api/getMosqueCountries')
.then(response =>response.json())
.then(json => getMosqueCountries(json));

function getMosqueCountries(data){
    data.forEach(element => {
        let option = document.createElement('option');
        option.value = element.id;
        option.text = element.name;
        selectCountryM.appendChild(option);
        
        
    });
}

$(document).ready(function () {
    $('#countryM').on('change', function () {
        var countryId = this.value;

        $('#mosque').html('');
        $.ajax({
            url: 'https://admin.prayerdisplay.com/api/getMosques?country_id='+countryId,
            type: 'get',
            success: function (res) {
                $('#mosque').html('<option value="">Select Mosque</option>');
               
                $.each(res, function (key, value) {

                    $('#mosque').append('<option value="' + value
                        .id + '">' + value.name + '</option>');
                });
            }
        });
    });

});

$('#mosque-sub-btn').click(function(){
    const mosqueId = selectMosque.value;
    if(mosqueId=='') alert('Please Select Country and Mosque');
    else{
        $.ajax({
            url: 'https://admin.prayerdisplay.com/api/getMosqueSchedule?mosque_id='+mosqueId,
            type: 'get',
            success: function (res) {
               
              if(res.success==true){
                  const notices = res.notices;
                  const photos = res.photos;
                  const mosqueName = res.mosque_name;
                 
                  $('#compassDiv').hide();
                  $('.imageSlider').show();
                  $('#marquee').empty();
                   $('#imgSlider').empty();
                   $('#prayer').hide();
                  modal.style.display = "none";
                  notices.forEach(element => {
                     
                      $('#marquee').append("<span> **"+element.notice+"** </span>");

                 });
                
                 photos.forEach(element => {
                    
                    $('#imgSlider').append('<img class="mySlides"  src="https://admin.prayerdisplay.com/public/images/'+element.photo+'">');
                     
                 });
                 locationText.innerText = mosqueName;
                 if(res.adhan!=null){
                     const start = res.adhan;
                     fajr.innerText = tConvert(start.fazar);
                     dhuhr.innerText = tConvert(start.dhuhr);
                     asr.innerText = tConvert(start.asr);
                     maghrib.innerText =(start.maghrib).replace(/^0+/, '');
                     isha.innerText = tConvert(start.isha);
                     
                     
                 }
                 else{
                     if(res.start!=null){
                        const start = res.start;
                        fajr.innerText = tConvert(start.fazar);
                        dhuhr.innerText = tConvert(start.dhuhr);
                        asr.innerText = tConvert(start.asr);
                        maghrib.innerText =(start.maghrib).replace(/^0+/, '');
                        isha.innerText = tConvert(start.isha);
                        

                     }
                     else{
                         if(res.jamat!=null){
                            const start = res.jamat;
                            fajr.innerText = tConvert(start.fazar);
                            dhuhr.innerText = tConvert(start.dhuhr);
                            asr.innerText = tConvert(start.asr);

                            maghrib.innerText =(start.maghrib).replace(/^0+/, '');
                            isha.innerText = tConvert(start.isha);

                         }
                     }
                 }

                 if(res.start!=null){
                    $('#start').show();
                    $('#start').click(function(){
                        const start = res.start;
                        fajr.innerText = tConvert(start.fazar);
                        dhuhr.innerText = tConvert(start.dhuhr);
                        asr.innerText = tConvert(start.asr);
                        maghrib.innerText =(start.maghrib).replace(/^0+/, '');
                        isha.innerText = tConvert(start.isha);
                        $('#start').css('color','chartreuse');
                        $('#jamat').css('color','white');
                        $('#adhan').css('color','white');
    
                     });
                 }
                 else  $('#start').hide();
                 if(res.adhan!=null){
                    $('#adhan').show();
                    $('#adhan').click(function(){
                        const start = res.adhan;
                        fajr.innerText = tConvert(start.fazar);
                        dhuhr.innerText = tConvert(start.dhuhr);
                        asr.innerText = tConvert(start.asr);
                        maghrib.innerText =(start.maghrib).replace(/^0+/, '');
                        isha.innerText = tConvert(start.isha);
                        $('#adhan').css('color','chartreuse');
                        $('#start').css('color','white');
                        $('#jamat').css('color','white');
    
                     });
                 }
                 else{
                    $('#adhan').hide();

                 }
                 if(res.jamat!=null){
                    $('#jamat').show();
                    $('#jamat').click(function(){
                        const start = res.jamat;
                        fajr.innerText = tConvert(start.fazar);
                        dhuhr.innerText = tConvert(start.dhuhr);
                        asr.innerText = tConvert(start.asr);
                        maghrib.innerText =(start.maghrib).replace(/^0+/, '');
                        isha.innerText = tConvert(start.isha);
                        $('#jamat').css('color','chartreuse');
                        $('#adhan').css('color','white');
                        $('#start').css('color','white');
    
                     });
                    
                 }
                 else  $('#jamat').hide();

                
                
               
                
                 
              }
              else{
                  alert('The data of selected mosque is not completed by the admin yet. Please select different mosue.')
              }
                
    
            }
            
        });

    }
    
    

    
});




