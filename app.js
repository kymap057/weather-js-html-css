// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value #temp");
const descElement = document.querySelector(".temperature-description .description");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const humidity= document.querySelector(".temp-value #humidity");
const speed_wind= document.querySelector(".temp-value #speed-wind");

// App data
const weather = {};
weather.positions={
    description:'latitude and longitude'
}
weather.temperature = {
    unit : "celsius"
}
weather.temp_max = {
    unit:'celsius'
}
weather.temp_min = {
    unit :'celsius'
}
// APP CONSTS AND VARS
const KELVIN = 273.15;
// API KEY
const key = "2967e25e97c66f1a694641102be5f7b8";
//language 
const lang = navigator.language;
weather.language= lang;
// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
    //console.log(navigator.geolocation)
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&lang=${lang}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.positions.lat = data.coord.lat;
            weather.positions.lon = data.coord.lon;
            weather.temperature.value = data.main.temp - KELVIN;
            weather.temp_max.value = data.main.temp_max-KELVIN;
            weather.temp_min.value = data.main.temp_min - KELVIN;
            weather.humidity = data.main.humidity;
            weather.speed_wind = data.wind.speed;
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
            //console.log(weather);
        });
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${Math.floor(weather.temperature.value)}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    speed_wind.innerHTML =`speed: ${weather.speed_wind} <span>m/s</span>`;
    humidity.innerHTML =`Humidity: ${weather.humidity} <span>%</span>`
    // tempMax.innerHTML=`max: ${Math.floor(weather.temp_max.value)}°<span>C</span>`;
    // tempMin.innerHTML=`min: ${Math.floor(weather.temp_min.value)}°<span>C</span>`;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        // let max = celsiusToFahrenheit(weather.temp_max.value);
        // let min = celsiusToFahrenheit(weather.temp_min.value);
        fahrenheit = Math.floor(fahrenheit);
        // max = Math.floor(max);
        // min= Math.floor(min);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        // tempMax.innerHTML=`max: ${max}°<span>F</span>`;  
        // tempMin.innerHTML=`min: ${min}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
        // weather.temp_max.unit= "fahrenheit";
        // weather.temp_min.unit= "fahrenheit";

    }else{
        tempElement.innerHTML = `${Math.floor(weather.temperature.value)}°<span>C</span>`;
        // tempMax.innerHTML=`max: ${Math.floor(weather.temp_max.value)}°<span>C</span>`;
        // tempMin.innerHTML=`min: ${Math.floor(weather.temp_min.value)}°<span>C</span>`;
        weather.temperature.unit = "celsius";
        // weather.temp_max.unit= "celsius";
        // weather.temp_min.unit= "celsius";
    }
});

