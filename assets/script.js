var apiKey = "d1e2d0763204896fd894698f5c6e27ee";
var today = moment().format('L');
var searchHistoryList = [];

//function to get live weather conditions;
function liveWeather(city) {
    
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  //use set "city" to execute current condition get request from weather api
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        console.log(cityWeatherResponse);
    //response to display live weather condition and city name    
        $("#currentWeather").css("display", "block");
        $("#currentCity").empty();
     //setting icons to represent weather conditions for seearched city   
        var weatherIcon = cityWeatherResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${weatherIcon}.png`;

        var searchedCity = $(`
            <h2 id="searchedCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
        `);
    //append #currentcity to searched City
        $("#currentCity").append(searchedCity);

  //using var lat and var lon to execute a current condition to get UV Index from weather api
        var lat = cityWeatherResponse.coord.lat;
        var lon = cityWeatherResponse.coord.lon;
        var uviApiURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.ajax({
            url: uviApiURL,
            method: "GET"
        }).then(function(uviResponse) {
            console.log(uviResponse);
    //creating a <p> to display the value of UV Index on webpag
            var uvIndex = uviResponse.value;
            var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);
   //appending #currentCity to UV Index value// 
            $("#cityDetail").append(uvIndexP);

            weatherForecast(lat, lon);
            if (uvIndex >= 0 && uvIndex <= 2) {   
            } else if (uvIndex >= 3 && uvIndex <= 5) {  
            } else if (uvIndex >= 6 && uvIndex <= 7) {   
            } else if (uvIndex >= 8 && uvIndex <= 10) {   
            } else {      
            };  
        });
    });
}

//creating a function for future weather conditions so user can view five day forecast
function weatherForecast(lat, lon) {
    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    //executing a future condition to get forecast data for five days
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(forecastData) {
        console.log(forecastData);
        $("#5-Day").empty();
        //for loop to generate weather forecate for five days 
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: forecastData.daily[i].dt,
                icon: forecastData.daily[i].weather[0].icon,
                temp: forecastData.daily[i].temp.day,
                humidity: forecastData.daily[i].humidity
            };

            var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${forecastData.daily[i].weather[0].main}" />`;

      //using jQuery to create div,<h5>,<p> to display weather conditions for the five day forecast//        
            var forecastDisplay = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currentDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

            $("#5-Day").append(forecastDisplay);
        }
    }); 
}

//adding click event listener to search button
$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $("#enterCity").val().trim();
       liveWeather (city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var displayedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
        $("#searchHistory").append(displayedCity);
    };
        //saving search history list to local storage
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});

//function to display forecast of searched cities saved in search history
$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    liveWeather(listCity);
});

//function to display last searched city when dash board is opened
$(document).ready(function() {
    var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

    if (searchHistoryArr !== null) {
        var lastSearchedIndex = searchHistoryArr.length - 1;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
       liveWeather(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }
});