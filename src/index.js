const weather = {
  apiKey: "aba6ff9d6de967d5eac6fd79114693cc",

  fetchWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    const cityElement = document.querySelector(".city");
    const iconElement = document.querySelector(".icon");
    const descriptionElement = document.querySelector(".description");
    const tempElement = document.querySelector(".temp");
    const humidityElement = document.querySelector(".humidity");
    const windElement = document.querySelector(".wind");

    cityElement.innerText = "Weather in " + name;
    iconElement.src = `https://openweathermap.org/img/wn/${icon}.png`;
    descriptionElement.innerText = description;
    tempElement.innerText = temp + "°C";
    humidityElement.innerText = "Humidity: " + humidity + "%";
    windElement.innerText = "Wind speed: " + speed + " km/h";

    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
  },

  search: function () {
    const city = document.querySelector(".search-bar").value;
    this.fetchWeather(city);
  },
};

const geocode = {
  reverseGeocode: function (latitude, longitude) {
    const apikey = "90a096f90b3e4715b6f2e536d934c5af";
    const api_url = "https://api.opencagedata.com/geocode/v1/json";
    const request_url = `${api_url}?key=${apikey}&q=${encodeURIComponent(
      latitude + "," + longitude
    )}&pretty=1&no_annotations=1`;

    const request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      if (request.status == 200) {
        const data = JSON.parse(request.responseText);
        weather.fetchWeather(data.results[0].components.city);
        console.log(data.results[0].components.city);
      } else if (request.status <= 500) {
        console.log("Unable to geocode! Response code: " + request.status);
        const data = JSON.parse(request.responseText);
        console.log("Error message: " + data.status.message);
      } else {
        console.log("Server error");
      }
    };

    request.onerror = function () {
      console.log("Unable to connect to server");
    };

    request.send();
  },

  getLocation: function () {
    function success(data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    } else {
      weather.fetchWeather("Delhi");
    }
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

weather.fetchWeather("Delhi");

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

geocode.getLocation();
