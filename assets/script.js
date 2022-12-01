//list of variables
var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
var apiKey = "d1e2d0763204896fd894698f5c6e27ee";
var waetherIcon = cityWeatherResponse.weather[0].icon;
var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
var current = moment().format('L');
var searchHistoryList = [];
var lat = cityWeatherResponse.coord.lat;
var lon = cityWeatherResponse.coord.lon;
var uviApiURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;