// Google Map API
// Reference: https://developers.google.com/maps/documentation/javascript/examples/directions-panel

// Define town latitude and longitude GPS coordinates for each town
var standrews = {lat: 56.341099, lng: -2.796610};
var cupar = {lat: 56.320190, lng: -3.009685}; 
var dundee = {lat: 56.463391, lng: -2.970611}; 
var newportOnTay = {lat: 56.440354, lng: -2.940728};

// Create Map and display floating panel to choose start and end point of route
function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 10,
        center: {
            lat: 56.226288,
            lng: -3.127024
        }
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

    var control = document.getElementById('floating-panel');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
    setTravel();
}
// Calculate shortest route and display right panel including directions
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

// Define options for start and end date selection in floating panel
function setTravel() {
    var options = ["St Andrews", "Cupar", "Dundee", "Newport-on-Tay"]; 
    var selectStart = document.getElementById("start");
    selectStart.innerHTML = "";
    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectStart.appendChild(el);
    }

    var selectEnd = document.getElementById("end"); 
    selectEnd.innerHTML = "";
    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectEnd.appendChild(el);
    }
}

// Display map by clicking on map button
$("#mapModal").on("shown.bs.modal", function () {
    var mapBody = initMap();
    $("googleMap").append(mapBody);
});

// OpenWeatherMap API
// Reference current weather: https://openweathermap.org/current
// Reference 5 day weather forecast: https://openweathermap.org/forecast5
// Code inspired by Captain Coder Tutorial "How to Create a Weather App in JavaScript" (https://www.youtube.com/watch?v=OFjxqzMTsBc&list=PL7C8fMD-89DLXOLuwjofJJ9smB_LmVGeu)
// and by Alvaro Gomez Tutorial "Angular 2 - weather application" (https://www.youtube.com/watch?v=0YSFRBN1OVI&list=PLONAys1AYOAmZ27U0eAerFlHkUXLa5cii)

// Definition of variables
var weatherAppId = "3fc0b6975b0bd478ce8c40bdc24b9dc1";
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;
var day;
var forecastIcon;
var forecastTemp;
var cityId;

// City ids for towns
var standrewsId = "2638864";
var cuparId = "2651698"; 
var dundeeId = "2650752"; 
var newportOnTayId = "2641598";

// API call for current weather data
function updateById(cityId) {
    var url="http://api.openweathermap.org/data/2.5/weather?" +
        "id=" + cityId +
        "&APPID=" + weatherAppId;
    sendRequest(url);
    console.log(url)    
}

// API call for forecast weather data
function updateForecastId(cityId) {
    var forecastUrl="http://api.openweathermap.org/data/2.5/forecast?" +
        "id=" + cityId +
        "&APPID=" + weatherAppId;
    requestForecast(forecastUrl);    
    console.log(forecastUrl)    
}

// Retrieve forecast weather data from URL
function requestForecast(forecastUrl) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var forecastData = JSON.parse(xmlhttp.responseText);
        var forecastFive = [];
        // Loop to get every eighth data data set (every 24h)
        for (let i=0; i<forecastData.list.length; i+=8) {
            var forecast = {};
            forecast.forecastIcon = forecastData.list[i].weather[0].icon;
            forecast.day = timeConverter( forecastData.list[i].dt);
            forecast.forecastTemp = K2C(forecastData.list[i].main.temp);
            forecastFive.push(forecast);
            console.log(forecastFive);
        }
        updateForecast(forecastFive);
    }
    };
    xmlhttp.open("GET", forecastUrl, true);
    xmlhttp.send();
}

// Retrieve current weather data from URL
function sendRequest(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            var weather = {};
            weather.icon = data.weather[0].icon;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            weather.direction = degreesToDirection(data.wind.deg);
            weather.loc = data.name;
            weather.temp = K2C(data.main.temp);
            update(weather);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Convert wind direction value to direction
function degreesToDirection(degrees) {
    var range = 360/8;
    var low = 360 - range/2;
    var high = (low + range) % 360;
    var angles = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    for (i in angles) {
        if(degrees >= low && degrees < high)
            return angles[i];

            low = (low + range) % 360;
            high = (high + range) % 360;
    }
    return "N";
}

// Convert Kelvin in Celsius
function K2C(k) {
    return Math.round(k-273.15);
}

// Convert unix time to date containing day and month
function timeConverter(unixTime) {
    var a = new Date(unixTime * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month;
    return time;
}

// Display weather forecast
function updateForecast(forecastFive) {

    //D3 Chart for weather forecast
    var dataArray = forecastFive;
                
    var barWidth = 60;
    var margin_bars = 10;
    var margin = 20;
    var chartHeight = 300;
    var chartWidth = 400;
    var minimum = 0, maximum = 50;
    var minimumColor = "#0078EE", maximumColor = "#001E3B";

    // Scale height of bars based on highest temperature
    var tempExtent = d3.extent(dataArray, function(d) {
    return parseInt(d.forecastTemp);
    })

    var minTemp = tempExtent[0];
    var maxTemp = tempExtent[1];
    console.log(tempExtent);    
        
    var heightScale = d3.scale.linear()
                        .domain([0, maxTemp])
                        .range([0, 280])

    
    // Create chart in svg element                    
    var canvas = d3.select("svg")

    canvas.selectAll("g").remove();

    var groups = canvas.selectAll("g").data(dataArray).enter().append("g");

    // Add components to chart
    groups.append("rect")
                        .attr("width", barWidth)
                        .attr("height", function(d) {
                            return heightScale(d.forecastTemp);
                        })
                        .attr("x", function (d,i){
                            return margin + i*(barWidth + margin_bars);
                        })
                        .attr("y", function (d, i){
                            return chartHeight + margin - heightScale(d.forecastTemp);
                        })
                        .style("fill", "#001E3B")
    groups.append("text")
                        .attr("font-size", "16px")
                        .attr("x", function (d,i){
                            return margin + 10 + i*(barWidth + margin_bars);
                        })
                        .attr("y", 340)
                        .text (function (d) {
                            return d.day + ""
                        })
    groups.append("image")
                        .attr("xlink:href", function (d) {
                            return ("http://openweathermap.org/img/w/" + d.forecastIcon + ".png")
                        })      
                        .attr("width", 50)
                        .attr("x", function (d,i){
                            return margin + i*(barWidth + margin_bars + 2);
                        })
                        .attr("y", 350)

    groups.append("text")
                        .attr("x", function (d,i){
                            return margin + 20 + i*(barWidth + margin_bars);
                        })
                        .attr("y", 405)
                        .text (function (d) {
                            return "" + d.forecastTemp  + "°";
                        })                    
        
}
    
// Display current weather
function update(weather) {
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    humidity.innerHTML = weather.humidity;
    loc.innerHTML = weather.loc;
    temp.innerHTML = weather.temp;
    icon.src = "http://openweathermap.org/img/w/" + weather.icon + ".png";
}

// Load startSvg when the page has been loaded
window.onload = startSvg;

function startSvg(city)
{
    //$('svg').remove();
    //$("#myDiv").html="";
    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    direction = document.getElementById("direction");
    
    if (city == "St Andrews" || city == undefined) {
        cityId = standrewsId;
        console.log("cityid"+cityId);
    } else if (city == "Cupar") {
        cityId = cuparId;
    } else if (city == "Dundee") {
        cityId = dundeeId;
    } else if (city == "Newport") {
        cityId = newportOnTayId;
    }
    
    updateForecastId(cityId);
    console.log("test1");
    updateById(cityId);
    console.log("test2");
    console.log(cityId + " , " + city);
    
}