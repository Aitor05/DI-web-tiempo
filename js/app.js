
$(document).ready(function () {
    const apiKey = '0046e040a6639c76f2669ab0d5b8adc8'; // Coloca aquí tu clave de OpenWeather

    // Alterna el menú lateral y ajusta el contenido
    $('#burger-btn').click(function () {
        $('#sidebar').toggleClass('active');

        // En escritorio, mueve el contenido principal
        if ($(window).width() >= 768) {
            $('#main-content').toggleClass('shifted');
        }
    });

    $('#sidebar .nav-link').click(function () {
        $('#sidebar').removeClass('active');
        if ($(window).width() >= 768) {
            $('#main-content').removeClass('shifted');
        }
    });

    // Muestra la pantalla principal
    $('#home-link').click(function () {
        $('#main-content').html(`
                <h1>Your weather app</h1>
                <p>Know the weather at all time</p>
            `);
    });

    // Muestra la pantalla de búsqueda
    $('#search-link').click(function () {
        $('#main-content').html(`
                <h2>Search by city:</h2>
                <form id="weather-form">
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" class="form-control" placeholder="Enter city name">
                    </div>
                    <button type="submit" class="btn btn-primary">Search</button>
                </form>
                <div id="weather-result" class="mt-4"></div>
            `);

        // Manejo del formulario de búsqueda
        $('#weather-form').submit(function (e) {
            e.preventDefault();
            const city = $('#city').val();
            getWeatherByCity(city);
        });
    });

    // Muestra el clima de la ubicación actual
    $('#location-link').click(function () {
        $('#main-content').html(`
                <h2>Weather at your location:</h2>
                <div id="weather-result" class="mt-4"></div>
            `);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    getWeatherByLocation(lat, lon);
                },
                (error) => {
                    $('#weather-result').html('<p class="text-danger">Unable to retrieve your location.</p>');
                }
            );
        } else {
            $('#weather-result').html('<p class="text-danger">Geolocation is not supported by your browser.</p>');
        }
    });

    function getWeatherByCity(city) {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                displayWeather(data, data.city.name);
            },
            error: function () {
                $('#weather-result').html('<p class="text-danger">City not found. Please try again.</p>');
            }
        });
    }

    function getWeatherByLocation(lat, lon) {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                displayWeather(data, data.city.name);
            },
            error: function () {
                $('#weather-result').html('<p class="text-danger">Unable to retrieve weather data for your location.</p>');
            }
        });
    }

    function displayWeather(data, location) {
        const forecastList = data.list;
        const dailyData = {};

        // Agrupar datos por día
        forecastList.forEach(entry => {
            const date = new Date(entry.dt * 1000).toLocaleDateString();
            if (!dailyData[date]) {
                dailyData[date] = [];
            }
            dailyData[date].push(entry);
        });

        const currentWeather = forecastList[0];
        const currentIcon = currentWeather.weather[0].icon;
        const currentWeatherMain = currentWeather.weather[0].main;
        const currentTemp = currentWeather.main.temp;

        let forecastHtml = `
            <h3>Weather in ${location}</h3>
            <p>Current weather: <img src="https://openweathermap.org/img/wn/${currentIcon}.png" alt="weather icon"> ${currentWeatherMain}, ${currentTemp}°C</p>
            <h4>4-Day Forecast:</h4>
            <div class="forecast-container d-flex justify-content-between row">
        `;

        // Mostrar previsión de los próximos 4 días en horizontal
        Object.keys(dailyData).slice(1, 5).forEach(date => {
            const dayData = dailyData[date];
            const dayTempAvg = (dayData.reduce((sum, entry) => sum + entry.main.temp, 0) / dayData.length).toFixed(1);
            const dayWeather = dayData[0].weather[0].main;
            const dayIcon = dayData[0].weather[0].icon;

            forecastHtml += `
                <div class="forecast-day text-center p-2 col-sm-6 col-lg-3">
                    <p><strong>${date}</strong></p>
                    <p><img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="weather icon"> ${dayWeather}</p>
                    <p>Avg Temp: ${dayTempAvg}°C</p>
                </div>
            `;
        });

        forecastHtml += `</div>`;
        $('#weather-result').html(forecastHtml);
    }
});