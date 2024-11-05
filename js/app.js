$(document).ready(function () {
  const apiKey = '0046e040a6639c76f2669ab0d5b8adc8';

  // Alterna el menú lateral y ajusta el contenido
  $('#burger-btn').click(function () {
      $('#sidebar').toggleClass('active');
      $('#main-content').toggleClass('shifted');
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
      
      // Verifica si el navegador soporta geolocalización
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

  // Función para obtener el clima usando el nombre de la ciudad
  function getWeatherByCity(city) {
      $.ajax({
          url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
          type: 'GET',
          dataType: 'json',
          success: function (data) {
              displayWeather(data, city);
          },
          error: function () {
              $('#weather-result').html('<p class="text-danger">City not found. Please try again.</p>');
          }
      });
  }

  // Función para obtener el clima usando latitud y longitud
  function getWeatherByLocation(lat, lon) {
      $.ajax({
          url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
          type: 'GET',
          dataType: 'json',
          success: function (data) {
              displayWeather(data, "your location");
          },
          error: function () {
              $('#weather-result').html('<p class="text-danger">Unable to retrieve weather data for your location.</p>');
          }
      });
  }

  // Función para mostrar el clima
  function displayWeather(data, location) {
      const weather = data.weather[0].main;
      const temp = data.main.temp;
      const iconCode = data.weather[0].icon;
      $('#weather-result').html(`
          <h3>Weather in ${location}</h3>
          <p><img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="weather icon"> ${weather}</p>
          <p>Temperature: ${temp}°C</p>
      `);
  }
});
