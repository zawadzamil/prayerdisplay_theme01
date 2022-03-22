
// Get Country City
$.getJSON('https://api.ipify.org?format=json', function(data){
    

    
$.getJSON('https://admin.prayerdisplay.com/api/getLocation?ip='+data.ip,function(json){
    getCity(json);

})

});
$('#start').hide();
$('#adhan').hide();
$('#jamat').hide();
 


let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

// Getting All Time Fields
const fajr = document.getElementById('fajr');
const dhhr = document.getElementById('dhhr');
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
        playButton.style.backgroundColor = 'red';
        alert('Adhan Autoplay Enabled')
        clicked = true;
    }
    else{
        playButton.style.backgroundColor = 'inherit';
        clicked = false;
        alert('Adhan Autoplay Disabled')
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




function getCity(data)
{
   let city = data.cityName;
   let country = data.countryName;
   locationText.innerText = city +', '+ country;
   let today = new Date();
   


   fetch('https://api.aladhan.com/v1/calendarByCity?city='+city+'&country='+country+'&method=1&month='+mm+'&year='+yyyy+' ')
   .then(response => response.json())
   .then(json =>saveToArray(json));
 
    
    
}

function saveToArray(json){
    const data = json.data;
    let latitude;
    let longitude ;
   
    
    data.forEach(element => {
      
        const timings = element.timings;
        let Fajr = timings.Fajr.replace(/ *\([^)]*\) */g, "");
        let Dhuhr = timings.Dhuhr.replace(/ *\([^)]*\) */g, "");
        let Maghrib = timings.Maghrib.replace(/ *\([^)]*\) */g, "");
        let Isha = timings.Isha.replace(/ *\([^)]*\) */g, "");
        

        let Asr = timings.Asr.replace(/ *\([^)]*\) */g, "");

        Fajr = tConvert(Fajr);
        Dhuhr = tConvert(Dhuhr);
        Asr = tConvert(Asr);
        Maghrib = tConvert(Maghrib);
        Isha = tConvert(Isha);

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
      if(compassPosition(direction)=='NE') compassDirecton = (compassDirecton-45);
      else if(compassPosition(direction)=='E') compassDirecton = (compassDirecton-90);
      else if(compassPosition(direction)=='SE') compassDirecton = (compassDirecton-135);
      else if(compassPosition(direction)=='S') compassDirecton = (compassDirecton-180);
      else if(compassPosition(direction)=='SW') compassDirecton =(compassDirecton-225);
      else if(compassPosition(direction)=='W') compassDirecton = (compassDirecton-270);
      else if(compassPosition(direction)=='NW') compassDirecton = (compassDirecton-315);
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
      .setProperty('--degreeFrom', direction+'deg');
      document.documentElement.style
      .setProperty('--degreeTo', offset+'deg');
      

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
    if(angle>=0 && angle < 30){
        coordinate = "N";
    }
    else if(angle>=30 && angle<=60){
        coordinate = "NE";
    }
    else if(angle>60 && angle<120 ){
        coordinate = "E";
    }
    else if(angle>=120 && angle<=150 ){
        coordinate = "SE";
    }
    else if(angle>150 && angle<210 ){
        coordinate = "S";
    }
    else if(angle>=210 && angle<=240 ){
        coordinate = "SW";
    }
    else if(angle>240 && angle<300 ){
        coordinate = "W";
    }
    else if(angle>=300 && angle<=330 ){
        coordinate = "NW";
    }
    else{
        coordinate = "N";
    }
    return coordinate;

}









 
  
  
 
  
  


