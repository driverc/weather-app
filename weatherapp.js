//Google Maps API: set location using Autocomplete object
var autocomplete;

var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
};

function initAutocomplete(){
    // Create the autocomplete object, restricting the search to geographical location types.
    var input = document.getElementById('location');
    //autocomplete = new google.maps.places.Autocomplete(input);  // <- for avoiding geolocate feature. also comment out geolocate function on next line and in index.html
    autocomplete = new google.maps.places.Autocomplete((input),{types: ['geocode']});
    autocomplete.addListener('place_changed', fillInAddress);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

function fillInAddress() {
    //Get place details from autocomplete obj
    var place = autocomplete.getPlace();
    for (var component in componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
    }
    // Get each component of the address from the place details
    // and fill the corresponding field on the componentform.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
    todaysWeather();
}

//Retrieving weather information from openweathermap.org API. Functions to get today's weather, and a 5 day forecast
function todaysWeather(){

    var weatherApiCall = "//api.openweathermap.org/data/2.5/weather?q=";
    var celsiusSelected = document.getElementById("celsius");
    var fahrenheitSelected = document.getElementById("fahrenheit");

    //get location from google maps API input
    for (var component in componentForm) {
		if(component != "") {
    	weatherApiCall = weatherApiCall + document.getElementById(component).value + ",";
		}
    }

    //add API key
    weatherApiCall = weatherApiCall + "&appid=875519c8ac11cf703a8824646361f8bf";

    //change units based on radio buttons
    var scale;
    if(celsiusSelected.checked == true){
        weatherApiCall = weatherApiCall + "&units=metric";
        scale = " &degC";
    }
    if(fahrenheitSelected.checked == true){
        weatherApiCall = weatherApiCall + "&units=imperial";
        scale = " &degF";
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4){
            var jsonweather = JSON.parse(xhr.responseText);
            var icon = jsonweather.weather[0].icon;
            document.getElementById("current").innerHTML = "Current Weather";
            document.getElementById("current_location").innerHTML = jsonweather.name; 
            document.getElementById("conditions").innerHTML = jsonweather.weather[0].main;
            document.getElementById("cond_detail").innerHTML = jsonweather.weather[0].description;
            document.getElementById("current_temp").innerHTML = Math.round(jsonweather.main.temp)+scale;
            document.getElementById("weather_icon").src = "http://openweathermap.org/img/w/"+icon+".png";
        }
    }
    xhr.open("GET", weatherApiCall, true);
    xhr.send();
    fiveDayForecast();
}

function fiveDayForecast() {

    var weatherApiCall = "//api.openweathermap.org/data/2.5/forecast?q=";
    var celsiusSelected = document.getElementById("celsius");
    var fahrenheitSelected = document.getElementById("fahrenheit");
    var day_list = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var month_list = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var scale;

    //get location from google maps API input
    for (var component in componentForm) {
		if(component != "") {
    	weatherApiCall = weatherApiCall + document.getElementById(component).value + ",";
		}
    }

    //add API key
    weatherApiCall = weatherApiCall + "&appid=875519c8ac11cf703a8824646361f8bf";

    //change units based on radio buttons
    if(celsiusSelected.checked == true){
        weatherApiCall = weatherApiCall + "&units=metric";
        scale = " &degC";
    }
    if(fahrenheitSelected.checked == true){
        weatherApiCall = weatherApiCall + "&units=imperial";
        scale = " &degF"
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            var jsonweather = JSON.parse(xhr.responseText);
            document.getElementById("5day").innerHTML = "5 Day Forecast";
            //5 day forecast day 1
            var day1 = new Date(jsonweather.list[1].dt * 1000);
            var day1_display = day_list[day1.getDay()];
            var day1_month = month_list[day1.getMonth()];
            var day1_date = day1.getDate();
            var icon1 = jsonweather.list[3].weather[0].icon;
            document.getElementById('day1').innerHTML = day1_display;
            document.getElementById('day-date1').innerHTML = day1_month + ' ' + day1_date;
            document.getElementById('conditions1').innerHTML = jsonweather.list[3].weather[0].main;
            document.getElementById('description1').innerHTML = jsonweather.list[3].weather[0].description;
            document.getElementById('high_temp1').innerHTML = Math.round(jsonweather.list[3].main.temp)+scale;
            document.getElementById("weather_icon_1").src = "http://openweathermap.org/img/w/"+icon1+".png";

            //5 day forecast day 2
            var day2 = new Date(jsonweather.list[9].dt * 1000);
            var day2_display = day_list[day2.getDay()];
            var day2_month = month_list[day2.getMonth()];
            var day2_date = day2.getDate();
            var icon2 = jsonweather.list[11].weather[0].icon;
            document.getElementById('day2').innerHTML = day2_display;
            document.getElementById('day-date2').innerHTML = day2_month + ' ' + day2_date;
            document.getElementById('conditions2').innerHTML = jsonweather.list[11].weather[0].main;
            document.getElementById('description2').innerHTML = jsonweather.list[11].weather[0].description;
            document.getElementById('high_temp2').innerHTML = Math.round(jsonweather.list[11].main.temp)+scale;
            document.getElementById("weather_icon_2").src = "http://openweathermap.org/img/w/"+icon2+".png";

            //5 day forecast day 3
            var day3 = new Date(jsonweather.list[17].dt * 1000);
            var day3_display = day_list[day3.getDay()];
            var day3_month = month_list[day3.getMonth()];
            var day3_date = day3.getDate();
            var icon3 = jsonweather.list[19].weather[0].icon;
            document.getElementById('day3').innerHTML = day3_display;
            document.getElementById('day-date3').innerHTML = day3_month + ' ' + day3_date;
            document.getElementById('conditions3').innerHTML = jsonweather.list[19].weather[0].main;
            document.getElementById('description3').innerHTML = jsonweather.list[19].weather[0].description;
            document.getElementById('high_temp3').innerHTML = Math.round(jsonweather.list[19].main.temp)+scale;
            document.getElementById("weather_icon_3").src = "http://openweathermap.org/img/w/"+icon3+".png";

            //5 day forecast day 4
            var day4 = new Date(jsonweather.list[26].dt * 1000);
            var day4_display = day_list[day4.getDay()];
            var day4_month = month_list[day4.getMonth()];
            var day4_date = day4.getDate();
            var icon4 = jsonweather.list[27].weather[0].icon;
            document.getElementById('day4').innerHTML = day4_display;
            document.getElementById('day-date4').innerHTML = day4_month + ' ' + day4_date;
            document.getElementById('conditions4').innerHTML = jsonweather.list[27].weather[0].main;
            document.getElementById('description4').innerHTML = jsonweather.list[27].weather[0].description;
            document.getElementById('high_temp4').innerHTML = Math.round(jsonweather.list[27].main.temp)+scale;
            document.getElementById("weather_icon_4").src = "http://openweathermap.org/img/w/"+icon4+".png";

            //5 day forecast day 5
            var day5 = new Date(jsonweather.list[34].dt * 1000);
            var day5_display = day_list[day5.getDay()];
            var day5_month = month_list[day5.getMonth()];
            var day5_date = day5.getDate();
            var icon5 = jsonweather.list[35].weather[0].icon;
            document.getElementById('day5').innerHTML = day5_display;
            document.getElementById('day-date5').innerHTML = day5_month + ' ' + day5_date;
            document.getElementById('conditions5').innerHTML = jsonweather.list[35].weather[0].main;
            document.getElementById('description5').innerHTML = jsonweather.list[35].weather[0].description;
            document.getElementById('high_temp5').innerHTML = Math.round(jsonweather.list[35].main.temp)+scale;
            document.getElementById("weather_icon_5").src = "http://openweathermap.org/img/w/"+icon5+".png";
        }
    }
    xhr.open("GET", weatherApiCall, true);
    xhr.send();
}




