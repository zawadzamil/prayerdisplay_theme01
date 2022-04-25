
// Get Country City
$.getJSON('https://api.ipify.org?format=json', function(data){
    

    
$.getJSON('https://admin.prayerdisplay.com/api/getLocation?ip='+data.ip,function(json){
    getCity(json,1);

})

});
let now = 0;
$('#start').hide();
$('#adhan').hide();
$('#jamat').hide(); 

let isFull = false;
function fullscreen(){
    if(!isFull){
        document.documentElement.requestFullscreen();
        isFull = true;
    }
    else{
        document.exitFullscreen();
        isFull = false;
    }

}

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

// Getting All Time Fields
const fajr = document.getElementById('fajr');
const dhuhr = document.getElementById('dhuhr');
const asr = document.getElementById('asr');
const maghrib = document.getElementById('maghrib');
const isha = document.getElementById('isha');

const locationText = document.getElementById('location');

const compass = document.getElementById('pointer');
const angle  = document.getElementById('angle');
const coordinate  = document.getElementById('coordinate');


const hijriDate = document.getElementById('hijriDate');
// Playbutton Autoplay or Not
const playButton = document.getElementById('playButton');
let clicked = false;
playButton.addEventListener('click',function(){
    if(!clicked)
    {
        playButton.style.color = 'lightgreen';
        alert('Adhan Autoplay Enabled')
        clicked = true;
        $('#autoplayText').text('(Adhan On)')
    }
    else{
        playButton.style.color = 'white';
        clicked = false;
        alert('Adhan Autoplay Disabled');
        $('#autoplayText').text('(Adhan Off)')
    }
    
});

$('#compassDiv').show();
$('.imageSlider').hide();


//Image Slider
var slideIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > x.length) { slideIndex = 1 }
  x[slideIndex - 1].style.display = "block";
  setTimeout(carousel, 3000); // Change image every 3 seconds
}




function getCity(data,method)
{
   let city = data.cityName;
   let country = data.countryName;
   locationText.innerText = city +', '+ country;
   let today = new Date();
   


   fetch('https://api.aladhan.com/v1/calendarByCity?city='+city+'&country='+country+'&method='+method+'&month='+mm+'&year='+yyyy+' ')
   .then(response => response.json())
   .then(json =>saveToArray(json));
 
    
    
}

function saveToArray(json){
    const data = json.data;
    let latitude;
    let longitude ;
    console.log(data);
   
    
    data.forEach(element => {
      
        const timings = element.timings;
        let Fajr = timings.Fajr.replace(/ *\([^)]*\) */g, "");
        let Dhuhr = timings.Dhuhr.replace(/ *\([^)]*\) */g, "");
        let Maghrib = timings.Maghrib.replace(/ *\([^)]*\) */g, "");
        let Isha = timings.Isha.replace(/ *\([^)]*\) */g, "");
        let Sunrise = timings.Sunrise.replace(/ *\([^)]*\) */g, "");
        let Asr = timings.Asr.replace(/ *\([^)]*\) */g, "");

        Fajr = tConvert(Fajr);
        Dhuhr = tConvert(Dhuhr);
        Asr = tConvert(Asr);
        Maghrib = tConvert(Maghrib);
        Isha = tConvert(Isha);
        Sunrise = tConvert(Sunrise);

        const date = element.date; 
        //Getting Hijri date from API
        const hijri = date.hijri;
        const hijriWeekday = hijri.weekday.en;
        const hijriDay = hijri.day;
        const hijriMonth = hijri.month.en;
        const hijriYear = hijri.year;
       
        
        ///////////////////////


        const day = date.gregorian.day;
        const month = date.gregorian.month.number;
        const year = date.gregorian.year;
        //If day is today
       if(dd == day && mm == month && yyyy == year )
       {
          fajr.innerText = Fajr;
          dhuhr.innerText = Dhuhr;
          asr.innerText = Asr;
          maghrib.innerText = Maghrib;
          isha.innerText = Isha;
          $('#sun').text(Sunrise);
          hijriDate.innerText = hijriWeekday+', '+hijriDay+' '+hijriMonth+', '+hijriYear;
       }
       //
       //Getting Latitude and Longitude from API
       const directions = element.meta;
       latitude = directions.latitude;
       longitude = directions.longitude;
       ///////////////////
       
      
    });
    //Fetching Qibla Direction
    fetch('https://api.aladhan.com/v1/qibla/'+latitude+'/'+longitude+'')
    .then(response => response.json())
    .then(json => getQiblaDirection(json));
    
}
// 24h to 12h 
function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  function getQiblaDirection(data){
      let direction = parseInt(data.data.direction);
      let compassDirecton = direction;
      coordinate.innerText = compassPosition(direction);
      if(compassPosition(direction)=='EN') compassDirecton = (90-compassDirecton);
      else if(compassPosition(direction)=='ES') compassDirecton = (compassDirecton-90);
      else if(compassPosition(direction)=='SE') compassDirecton = (180-compassDirecton);
      else if(compassPosition(direction)=='SW') compassDirecton = (compassDirecton-180);
      else if(compassPosition(direction)=='WS') compassDirecton =(270-compassDirecton);
      else if(compassPosition(direction)=='WN') compassDirecton = (compassDirecton-270);
      else if(compassPosition(direction)=='NW') compassDirecton = (360-compassDirecton);
      else compassDirecton = compassDirecton;
      angle.innerText = compassDirecton;
      
      
      let offset;
     
      if(direction >90){
          direction = direction-90;
         offset = direction ; 
      }
      else{
          direction = 270+direction;
          offset = direction ;
      }
      document.documentElement.style
      .setProperty('--degreeFrom', direction-12+'deg');
      document.documentElement.style
      .setProperty('--degreeTo', offset-12+'deg');
      

      //Finding Compass Direction
      
     
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
  
// Play Alarm
setInterval(() => {

    // If date changes, Reload the page.
    const dateNow = new Date();
    let dayNow =dateNow.getDate().toString();
    if(dayNow != date){
        location.reload();
    }

    let fullTime = getLocalTime();
      const fazar = document.getElementById('fajr').innerText;
      const duhur = document.getElementById('dhuhr').innerText;
      const asr = document.getElementById('asr').innerText;
      const magrib = document.getElementById('maghrib').innerText;
      const isha = document.getElementById('isha').innerText;
     
  
  
  
      var resultFazar = fullTime.localeCompare(fazar);
      var resultDuhur = fullTime.localeCompare(duhur);
      var resultAsr = fullTime.localeCompare(asr);
      var resultMagrib = fullTime.localeCompare(magrib);
      var resultIsha = fullTime.localeCompare(isha);
  
  
      if (resultFazar == 0) {
          console.log('Time Matched! Playing Fajar');
          if(clicked){
               playFazar();

          }
         
  
      }
      if (resultDuhur == 0 || resultAsr == 0 || resultMagrib == 0 || resultIsha == 0) {
        console.log('Time Matched! Playing Audio');
        if(clicked){
            play();
        }
         
      }
  
  }, 58000);
//Get Local Time Function
  function getLocalTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var time = tConvert(time); 
    return time;

};

// Play Fajr Adhan Function
function playFazar(){
    const music = new Audio('audio/azanFaraz.mp3');
    music.play();
}
// Play Other Adhan Function
function play(){
    const music = new Audio('audio/audio.mp3');
    music.play();
    
}

// Compass Position Function (N,NE,SW,SE etc)
function compassPosition(angle){
    let coordinate = "SW";
    if(angle>=0 && angle <= 45){
        coordinate = "NE";
    }
    else if(angle>45 && angle<=90){
        coordinate = "EN";
    }
    else if(angle>90 && angle<=135 ){
        coordinate = "ES";
    }
    else if(angle>135 && angle<=180 ){
        coordinate = "SE";
    }
    else if(angle>180 && angle<=225 ){
        coordinate = "SW";
    }
    else if(angle>225 && angle<=270 ){
        coordinate = "WS";
    }
    else if(angle>270 && angle<=315 ){
        coordinate = "WN";
    }
    
    else{
        coordinate = "NW";
    }
    return coordinate;

}


// Select MEthod of Prayer Schedule Calculation // ISNA/ 
$('#select').change(function(event){
    $(".loading").show();
    $(".loading").delay(2000).slideUp();
    const method = event.target.value;
    console.log(method);
    if(now==0){
        // Get Country City
$.getJSON('https://api.ipify.org?format=json', function(data){
    

    
    $.getJSON('https://admin.prayerdisplay.com/api/getLocation?ip='+data.ip,function(json){
        getCity(json,method);
    
    })
    
    });
    }
    else if(now==1){
        const cityId = selectCity.value;
        if (cityId == '') alert('Please Select Country and City');
        else{
            $.ajax({
                url: 'https://admin.prayerdisplay.com/api/getSingleCity?id=' + cityId,
                type: 'get',
                success: function (res) {  
                    const data = JSON.parse(res);
                    const city = data.city;
                    const country = data.country;
                    fetch('https://api.aladhan.com/v1/calendarByCity?city=' + city + '&country=' + country + '&method='+ method +'&month=' + mm + '&year=' + yyyy + ' ')
                        .then(response => response.json())
                        .then(json => saveToArray(json));
                }
    
            });
        }
    }
   
    
});

// function refreshAt(hours, minutes, seconds)
// {
//     var now = new Date(), then = new Date();
//     then.setHours(hours,minutes,seconds,0);
//     if(then.getTime()<now.getTime())
//     {
//         then.setDate(now.getDate() + 1);
//     }

//     var timeout = (then.getTime() - now.getTime());
//     setTimeout(function() { window.location.reload(true); }, timeout);
// }
// refreshAt(0,1,0);









 
  
  
 
  
  


