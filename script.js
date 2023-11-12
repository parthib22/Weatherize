pet = 0;
let weather = {
  apiKey: "6cb7ced7d19919873df5f93a31d36e86",
  fetchWeatherC: function (latitude, longitude) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=metric&appid=" +
        this.apiKey
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
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
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
    var { temp, feels_like, temp_max, temp_min } = data.main;
    const { humidity } = data.main;
    const { speed } = data.wind;
    const { country } = data.sys;

    n = name;

    temp = temp.toPrecision(2);
    feels_like = feels_like.toPrecision(2);
    temp_max = temp_max.toPrecision(2);
    temp_min = temp_min.toPrecision(2);

    document.querySelector(".city").innerHTML =
      "<span>Weather in</span> " + name + ", " + country;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + " °C";
    document.querySelector(".feel").innerHTML =
      "<span>Feels like:</span> " + feels_like + " °C";
    document.querySelector(".max").innerHTML =
      "<span>Max:</span> " + temp_max + " °C";
    document.querySelector(".min").innerHTML =
      "<span>Min:</span> " + temp_min + " °C";
    document.querySelector(".humidity").innerHTML =
      "<span>Humidity:</span> " + humidity + "%";
    document.querySelector(".wind").innerHTML =
      "<span>Wind speed:</span> " + speed + " k/h";
    document.querySelector(".weather").classList.remove("loading");

    if (pet != 0) {
      this.background_src(n);
    }
  },
  search: function () {
    var search_val = document.querySelector(".search-bar").value;
    this.fetchWeather(search_val.trim());
    pet = 1;
    document.querySelector(".weather").classList.add("loading");
  },
  background_src: function (source) {
    if (window.innerWidth > 1080) {
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1920x1080/?" + source + "')";
    } else {
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1080x1920/?" + source + "')";
    }
  },
};

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var api_key = "718be3bac33143749a5114aaa1d675cb";

    // reverse geocoding example (coordinates to address)
    var query = latitude + "," + longitude;

    // forward geocoding example (address to coordinate)
    // var query = 'Philipsbornstr. 2, 30165 Hannover, Germany';
    // note: query needs to be URI encoded (see below)

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      api_key +
      "&q=" +
      encodeURIComponent(query) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status === 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        // print the location
        // alert(data.results[0].components.town);
        // alert(data.results[0].components.suburb);
        console.log(data.results[0]);

        // pet = 1;

        weather.background_src(data.results[0].components.state);

        if (typeof data.results[0].components.town != "undefined") {
          weather.fetchWeather(data.results[0].components.town);
        } else if (typeof data.results[0].components.suburb != "undefined") {
          weather.fetchWeather(data.results[0].components.suburb);
        } else if (typeof data.results[0].components.city != "undefined") {
          weather.fetchWeather(data.results[0].components.city);
        } else if (typeof data.results[0].components.county != "undefined") {
          weather.fetchWeather(data.results[0].components.county);
        } else if (typeof data.results[0].components.state != "undefined") {
          weather.fetchWeather(data.results[0].components.state);
        } else if (
          typeof data.results[0].geometry.lat != "undefined" &&
          typeof data.results[0].geometry.lng != "undefined"
        ) {
          weather.fetchWeatherC(
            data.results[0].geometry.lat,
            data.results[0].geometry.lng
          );
        } else {
          alert('Do you even live here " ' + data.results[0].formatted + ' "?');
        }

        console.log(
          "Current location: " +
            data.results[0].formatted +
            " (" +
            data.results[0].geometry.lat +
            ", " +
            data.results[0].geometry.lng +
            ")"
        );
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send(); // make the request
  },
  geolocation: function () {
    function success(data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    } else {
      weather.fetchWeather("Kolkata");
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

geocode.geolocation();
