const apiKey = `dd499c53bfc32f27c1bfd797dc62f32e`; // Replace with your OpenWeather API key
//listens for a click on the search button
document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-search').value;
    getCoordinates(city);
});
//getting the coordinates of the city that the user inputs
function getCoordinates(city) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(lat, lon, city);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}
//getting the weather data of the city that the user inputs
function getWeather(lat, lon, city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data, city);
            updateForecast(data);
            addCityToHistory(city);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}
//updating the current weather of the city that the user inputs
function updateCurrentWeather(data, city) {
    const currentWeather = document.getElementById('current-weather');
    const date = new Date(data.list[0].dt * 1000).toLocaleDateString();
    const temp = data.list[0].main.temp;
    const wind = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;
    const icon = data.list[0].weather[0].icon;
    currentWeather.innerHTML = `
        <h1>${city} (${date}) <img src=“http://openweathermap.org/img/wn/${icon}.png” alt=“weather icon”></h1>
        <p>Temp: ${temp} °F</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity} %</p>
    `;
}
//updating the forecast of the city that the user inputs
function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
//looping through the data and displaying the forecast of the city that the user inputs
    for (let i = 0; i < 5; i++) {
        const date = new Date(data.list[i * 8].dt * 1000).toLocaleDateString();
        const temp = data.list[i * 8].main.temp;
        const wind = data.list[i * 8].wind.speed;
        const humidity = data.list[i * 8].main.humidity;
        const icon = data.list[i * 8].weather[0].icon;
//creating a div element and adding the forecast data to the div element
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>${date}</p>
            <p><img src=“http://openweathermap.org/img/wn/${icon}.png” alt=“weather icon”></p>
            <p>Temp: ${temp} °F</p>
            <p>Wind: ${wind} MPH</p>
            <p>Humidity: ${humidity} %</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}
//adding the city to the search history
function addCityToHistory(city) {
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
    if (!cityHistory.includes(city)) {
        cityHistory.push(city);
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
        displayCityHistory();
    }
}
//displaying the city history
function displayCityHistory() {
    const cityButtons = document.getElementById('city-buttons');
    cityButtons.innerHTML = '';
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
//looping through the city history and displaying the city history
    cityHistory.forEach(city => {
        const cityButton = document.createElement('div');
        cityButton.classList.add('city-button');
        //creating a button element and adding the city to the button element
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => {
            getCoordinates(city);
        });
        //creating a delete button and adding the city to the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete :point_up_2::skin-tone-4:';
        deleteButton.addEventListener('click', () => {
            deleteCityFromHistory(city);
        });
        cityButton.appendChild(button);
        cityButton.appendChild(deleteButton);
        cityButtons.appendChild(cityButton);
    });
}
//deleting the city from the search history
function deleteCityFromHistory(city) {
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
    cityHistory = cityHistory.filter(storedCity => storedCity !== city);
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
    displayCityHistory();
}
displayCityHistory();