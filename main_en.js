'use strict';
(function(){
	// -- Constants -------------------------------------------------------------

	var API_KEY = '6c4970df539586a06bd16eb724c3ad62';
	var API_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_KEY + "&";
  var IMG_WEATHER = "http://openweathermap.org/img/w/";

	// -- Varibles ---------------------------------------------------------------
	var celsius = true; 
	var localWeather = {};
	localWeather.weatherId;
  localWeather.city;
  localWeather.country;
  localWeather.icon;
  localWeather.main;
  localWeather.description;

  localWeather.tempF; // Temperature fahrenheit
  localWeather.tempC; // Temperature Celsius.
  localWeather.temp_maxC;
  localWeather.temp_minC;
  localWeather.temp_maxF;
  localWeather.temp_minF;
  
  localWeather.windSpeed;
  localWeather.humidity;
  localWeather.pressure;

  localWeather.sunrise;
  localWeather.sunset;

	// -- Functionses --------------------------------------------------------------
	// Detects the location and starts the application
	function onLoad() {
    $("#card-weather").hide();
    $("#changeUnit").hide();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoords, errorFound);
    } else {
      alert("Your browser does not support GeoLocation");
    }
  };

  // If an error occurs displays an alert with the error code.
  function errorFound(error) {
    alert('An error occurred: ' + error.code);
  };

  // Take the coordinates of browser and request a json with these weather.
	function getCoords(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    $.getJSON(API_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);
    //console.log($.getJSON(API_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather));
  }
	// Saves data to localWeather object properties.
	function getCurrentWeather(data) {
	    localWeather.weatherId   = data.weather[0].id;
	    localWeather.city        = data.name;
	    localWeather.country        = data.sys.country;
	    localWeather.icon        = IMG_WEATHER + data.weather[0].icon + ".png";
	    // Temperatures
	    localWeather.tempF			 = (((data.main.temp*9)/5)-459.67).toFixed(1);
	    localWeather.tempC       = (data.main.temp - 273.15).toFixed(1);
	    localWeather.temp_maxF    = (((data.main.temp_max*9)/5)-459.67).toFixed(1);
	    localWeather.temp_maxC    = (data.main.temp_max - 273.15).toFixed(1);
	    localWeather.temp_minF    = (((data.main.temp_min*9)/5)-459.67).toFixed(1);
	    localWeather.temp_minC    = (data.main.temp_min - 273.15).toFixed(1);
	    // Humidity & pressure
	    localWeather.humidity    = (data.main.humidity)+ '%';
	    localWeather.pressure    = (data.main.pressure);

	    // Sunrise and sunset.
	    var amanece 						= new Date(data.sys.sunrise*1000);
	    var anochece = new Date(data.sys.sunset*1000);
	    amanece =  amanece.toLocaleTimeString();
	    anochece =  anochece.toLocaleTimeString();
	    localWeather.sunrise     = amanece;
	    localWeather.sunset      = anochece;

	    // Weather description.
	    localWeather.description = data.weather[0].description;
	    localWeather.main        = data.weather[0].main;
			
	    // Wind
	    localWeather.windSpeed   = ((data.wind.speed)*1.852).toFixed(2) + ' km/h';
	    localWeather.windDirection   = convertWindDirection(data.wind.deg);

			changeBackground();
			render();
	  }

	// Converts the wind direction degrees to the wind rose code.
  function convertWindDirection(dir) {
    var rose = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    var points = Math.floor(dir / 45);
    return rose[points];
  }

  // Paint the query result to the API.
	function render () {
		$(".loader").hide();
		$("#card-weather").show();
		 $("#changeUnit").show();
		// Card header
		$("#city").text(localWeather.city + ', ' + localWeather.country);	
		$("#temp_max").text('max ' + localWeather.temp_maxC + ' ºC');	
		$("#temp_min").text('min ' + localWeather.temp_minC + ' ºC');	

		// Card body
		$("#weather-icon").attr("src",localWeather.icon);	
		$("#temp_current").text(localWeather.tempC + ' ºC');	
		$("#main").text(localWeather.description);
		// Card footer
		$("#wind").text('Wind: ' + localWeather.windDirection + ' ' +localWeather.windSpeed);	
		$("#humidity").text('Humidity: ' + localWeather.humidity);	
		$("#pressure").text('Pressure: ' + localWeather.pressure);	
		$("#sunrise").text('Sunrise: ' + localWeather.sunrise);	
		$("#sunset").text('Sunset: ' + localWeather.sunset);	
	}

	// Change the background image depending on the id of the current weather.
	function changeBackground () {
		var x = localWeather.weatherId;

		if(x >=200 && x < 300){
			$('#wrapper').addClass('thunderstorm');
		} 
		else if(x >= 500 && x < 600){
			$('#wrapper').addClass('rain');
		}
		else if(x >= 600 && x < 700){
			$('#wrapper').addClass('snow');
		}
		else if(x === 800){
			$('#wrapper').addClass('clear');
		}
		else if(x >800 && x < 810){
			$('#wrapper').addClass('clouds');
		}
	}

	// Switch between Celsius and Fahrenheit.
	
	$('.changeUnit').click(function () {
		if(celsius === true){
			$("#temp_current").text(localWeather.tempF + ' ºF');	
			$("#temp_max").text('max ' + localWeather.temp_maxF + ' ºF');	
			$("#temp_min").text('min ' + localWeather.temp_minF + ' ºF');	
			$('.changeUnit').text('Celsius');
			celsius = false;
		} else {
			$("#temp_current").text(localWeather.tempC + ' ºC');
			$("#temp_max").text('max ' + localWeather.temp_maxC + ' ºC');	
			$("#temp_min").text('min ' + localWeather.temp_minC + ' ºC');	
			$('.changeUnit').text('Farenheit');
			celsius = true;
		}
	});
	  
	// Start the APP.  
	onLoad();   

})();
