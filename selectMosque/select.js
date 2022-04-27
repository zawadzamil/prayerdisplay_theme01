

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const mosqueId = urlParams.get('id')




let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
$('#main').click(function () {
    window.location.href = "../index.html";

});
// Playbutton Autoplay or Not
const playButton = document.getElementById('playButton');
let clicked = false;
playButton.addEventListener('click', function () {
    if (!clicked) {
        playButton.style.color = 'red';
      
        clicked = true;
        $('#autoPlay').text('AdhanPlay(On)');
    }
    else {
        playButton.style.color = 'inherit';
        clicked = false;
       
        $('#autoPlay').text('AdhanPlay(Off)');
    }

});


// Date Day Finding Top Header Date Set
const weekday = ["SUN", "MON", "TUE", "WED", "THU", "Fri", "SAT"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dateBottom = document.getElementById('dateBottom')

const d = new Date();
let day = weekday[d.getDay()];
let month = months[d.getMonth()];
let date = d.getDate();
let year = d.getFullYear();

dateBottom.innerText = day + ' ' + month + ' ' + date + ' ' + year;
$.ajax({
    url: 'https://admin.prayerdisplay.com/api/getMosqueSchedule?mosque_id=' + mosqueId,
    type: 'get',
    success: function (res) {
        console.log(res)
        var i=3;

        if (res.success == true) {
            const notices = res.notices;
            const photos = res.photos;
            const mosqueName = res.mosque_name;



           
            // $('#imgSlider').empty();
            $('.slideshow-container').empty();


            notices.forEach(element => {
                let noticeCounter = 0;
                $('.slideshow-container').append('<div class="mySlides"> <q>'+ element.notice+'</q> </div>')

                

            });
            // photos.forEach(element => {
                

            //     $('#imgSlider').append('<img class="mySlides"  src="https://admin.prayerdisplay.com/public/images/' + element.photo + '">');

            // });
            $('#location').text(res.mosque_name);
            $('#address').text(res.address);
            $('#logoImage').attr("src","http://admin.prayerdisplay.com/public/images/"+res.logo);
            const city = res.city;
            const country = res.country;
            const method = res.method;
            
            fetch('https://api.aladhan.com/v1/calendarByCity?city=' + city + '&country=' + country + '&method='+ method +'&month=' + mm + '&year=' + yyyy + ' ')
                .then(response => response.json())
                .then(json => saveToArray(json));

            const adhan = res.adhan;
            const jamat = res.jamat;
            if (res.schedule.start == 0) {
                $('.start').each(function (i, obj) {
                    obj.style.display = 'none';
                    $('#sunRow').hide();
                });
                i=i-1;
            }

            if (res.schedule.adhan != 0) {
                $('#fajr_adhan').text(tConvert(adhan.fazar));
                $('#dhuhr_adhan').text(tConvert(adhan.dhuhr));
                $('#asr_adhan').text(tConvert(adhan.asr));
                $('#maghrib_adhan').text(tConvert(adhan.maghrib).replace(/^0+/, ''));
                $('#isha_adhan').text(tConvert(adhan.isha));
                $('#jummah_adhan').text(tConvert(adhan.jummah));

            }
            else {
                $('.adhan').each(function (i, obj) {
                    obj.style.display = 'none'
                });
                i=i-1;
            }


            if (res.schedule.jamat != 0) {
                $('#fajr_jamat').text(tConvert(jamat.fazar));
                $('#dhuhr_jamat').text(tConvert(jamat.dhuhr));
                $('#asr_jamat').text(tConvert(jamat.asr));
                $('#maghrib_jamat').text(tConvert(jamat.maghrib).replace(/^0+/, ''));
                $('#isha_jamat').text(tConvert(jamat.isha));
                $('#jummah_jamat').text(tConvert(jamat.jummah));

            }
            else {
                $('.jamat').each(function (i, obj) {
                    obj.style.display = 'none'
                });
                i=i-1;
            }

            if(i==3){
                document.documentElement.style
                .setProperty('--tmlPC','0px');

                document.documentElement.style
                .setProperty('--tmlmob','auto');
                
                document.documentElement.style
                .setProperty('--tmlLand','0px');
            }
            else if(i==2 || i==1){
                document.documentElement.style
                .setProperty('--tmlPC','100px');

                document.documentElement.style
                .setProperty('--tmlmob','36px');

                document.documentElement.style
                .setProperty('--tmlLand','66px');

            }
            const multipleJummah = res.jummah;
           if(multipleJummah.length!=0){
               $('#mul_row-1').show();
               if(res.schedule.start!=0){
                   $('#start1').show();
               }
               if(res.schedule.adhan!=0){
                $('#jummah_adhan1').show();
                if(multipleJummah[0].adhan !=null){
                    $('#jummah_adhan1').text(tConvert((multipleJummah[0].adhan).slice(0, -3)));

                }
               
            }
            if(res.schedule.jamat!=0){
                $('#jummah_jamat1').show();
                if(multipleJummah[0].jamat !=null){
                    $('#jummah_jamat1').text(tConvert((multipleJummah[0].jamat).slice(0, -3)));

                }
              
            }

            if(multipleJummah.length==2)
            {
                $('#mul_row-2').show();
                if(res.schedule.start!=0){
                    $('#start2').show();
                }
                if(res.schedule.adhan!=0){
                 $('#jummah_adhan2').show();
                 if(multipleJummah[1].adhan !=null){
                       $('#jummah_adhan2').text(tConvert((multipleJummah[1].adhan).slice(0, -3)));

                 }
                 
               
             }
             if(res.schedule.jamat!=0){
                 $('#jummah_jamat2').show();
                 if(multipleJummah[1].jamat !=null){
                      $('#jummah_jamat2').text(tConvert((multipleJummah[1].jamat).slice(0, -3)));

                 }
                
             }
            }
               
           }









        }
        else {
            alert("Sorry, This Mosque is not Available !")
            window.history.back();

        }
    }


});




function saveToArray(json) {
    const data = json.data;
    data.forEach(element => {
        const timings = element.timings;
        let Fajr = timings.Fajr.replace(/ *\([^)]*\) */g, "");
        let Dhuhr = timings.Dhuhr.replace(/ *\([^)]*\) */g, "");
        let Maghrib = timings.Maghrib.replace(/ *\([^)]*\) */g, "");
        let Isha = timings.Isha.replace(/ *\([^)]*\) */g, "");
        let Asr = timings.Asr.replace(/ *\([^)]*\) */g, "");
        let Sunrise = timings.Sunrise.replace(/ *\([^)]*\) */g, "");

        const date = element.date;
        //Getting Hijri date from API
        const hijri = date.hijri;
        const hijriWeekday = hijri.weekday.en;
        const hijriDay = hijri.day;
        const hijriMonth = hijri.month.en;
        const hijriYear = hijri.year;

        Fajr = tConvert(Fajr);
        Dhuhr = tConvert(Dhuhr);
        Asr = tConvert(Asr);
        Maghrib = tConvert(Maghrib);
        Isha = tConvert(Isha);
        Sunrise = tConvert(Sunrise);


        ///////////////////////


        const day = date.gregorian.day;
        const month = date.gregorian.month.number;
        const year = date.gregorian.year;
        //If day is today
        if (dd == day && mm == month && yyyy == year) {
            fajr.innerText = Fajr;
            $('#sun').text(Sunrise);
            dhuhr.innerText = Dhuhr;
            asr.innerText = Asr;
            maghrib.innerText = Maghrib;
            isha.innerText = Isha;
            hijriDate.innerText = hijriWeekday + ', ' + hijriDay + ' ' + hijriMonth + ', ' + hijriYear;
        }
    });
}





// //Image Slider
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  
}
window.onload= function () {
 setInterval(function(){ 
     plusSlides(1);
 }, 8000);
 }



// 24h to 12h 
function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}
// Time For Clock
let a;
let time;
setInterval(() => {
    a = new Date();
    let time = a.toLocaleTimeString();
    // time = a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds();
    document.getElementById('time').innerHTML = time;


}, 1000);

setInterval( ()=>{
     // If date changes, Reload the page.
     const dateNow = new Date();
     let dayNow =dateNow.getDate().toString();
     if(dayNow != date){
         location.reload();
     }
    $.ajax({
        url: 'https://admin.prayerdisplay.com/api/getMosqueSchedule?mosque_id=' + mosqueId,
        type: 'get',
        success: function (res) {
            if (res.success == true) {
                if (res.schedule.adhan != 0) {
    
                    let fullTime = getLocalTime();
                    const fazar = document.getElementById('fajr_adhan').innerText;
                    const duhur = document.getElementById('dhuhr_adhan').innerText;
                    const asr = document.getElementById('asr_adhan').innerText;
                    const magrib = document.getElementById('maghrib_adhan').innerText;
                    const isha = document.getElementById('isha_adhan').innerText;
    
    
    
    
                    var resultFazar = fullTime.localeCompare(fazar);
                    var resultDuhur = fullTime.localeCompare(duhur);
                    var resultAsr = fullTime.localeCompare(asr);
                    var resultMagrib = fullTime.localeCompare(magrib);
                    var resultIsha = fullTime.localeCompare(isha);
    
    
                    if (resultFazar == 0) {
                        console.log('Time Matched! Playing Fajar');
                        if (clicked) {
                            playFazar();
    
                        }
    
    
                    }
                    if (resultDuhur == 0 || resultAsr == 0 || resultMagrib == 0 || resultIsha == 0) {
                        console.log('Time Matched! Playing Audio');
                        if (clicked) {
                            play();
                        }
    
                    }
    
                }
    
            }
        }
    });

},58000)

//Get Local Time Function
function getLocalTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var time = tConvert(time); 
    return time;

};

// Play Fajr Adhan Function
function playFazar() {
    const music = new Audio('../audio/azanFaraz.mp3');
    music.play();
}
// Play Other Adhan Function
function play() {
    const music = new Audio('../audio/audio.mp3');
    music.play();

}

$(document).ready(function(){
    var loading = $(".loading");
    loading.delay(8000).slideUp();
  });

