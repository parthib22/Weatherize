// Global flag to track if background image should be updated
// 0 = initial load (no background update), 1 = user search or location found (update background)
let hasUserInteracted = 0;

// Global variable to store current city name for background image
// let currentCityName = "";

// Wait for DOM and config to be ready
document.addEventListener("DOMContentLoaded", function () {
  // Check if CONFIG is available, if not show helpful error
  if (typeof CONFIG === "undefined" || typeof window.CONFIG === "undefined") {
    console.error(
      "CONFIG is not defined. Please ensure config.js is loaded before script.js"
    );
    alert("Configuration error: API keys not found. Please check the setup.");
    return; // Stop execution if CONFIG is not available
  }

  console.log("CONFIG loaded successfully:", !!CONFIG);

  // Initialize time display and start the clock
  updateTime();
  setInterval(updateTime, 1000); // Update every second

  // Initialize the app once CONFIG is confirmed to be available
  geocoding.getCurrentLocation();
});

/**
 * Update the time display
 */
function updateTime() {
  const now = new Date();

  // Format time as HH:MM:SS
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format date as "Day, Mon DD, YYYY"
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Update the DOM elements
  const line1 = document.querySelector(".line1");
  const line2 = document.querySelector(".line2");

  if (line1) line1.textContent = timeString;
  if (line2) line2.textContent = dateString;
}

/**
 * Weather API handler object
 * Manages fetching weather data and updating the UI
 */
const weather = {
  // OpenWeatherMap API key - loaded from config (with fallback)
  get apiKey() {
    return (typeof CONFIG !== "undefined" && CONFIG.OPENWEATHER_API_KEY) || "";
  },

  /**
   * Fetch weather data using coordinates (latitude and longitude)
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   */
  fetchWeatherByCoordinates: function (latitude, longitude) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  /**
   * Fetch weather data using city name
   * @param {string} city - Name of the city
   */
  fetchWeatherByCity: function (city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.displayWeather(data);
      });
  },

  /**
   * Display weather data in the UI
   * @param {Object} data - Weather data from API response
   */
  displayWeather: function (data) {
    document.querySelector(".weather").classList.add("loading");

    // Extract data from API response
    const cityName = data.name;
    const { icon, description } = data.weather[0];
    const { humidity } = data.main;
    const { speed: windSpeed } = data.wind;
    const { country } = data.sys;
    const visibility = data.visibility / 1000; // Convert visibility to kilometers
    const pressure = data.main.pressure;

    weather.updateBackgroundImage(`${cityName} ${description}`);

    // Extract and format temperature data
    let { temp, feels_like, temp_max, temp_min } = data.main;

    // Store city name globally for background image
    // currentCityName = cityName;

    // Format temperatures to 2 significant digits
    temp = temp.toPrecision(2);
    feels_like = feels_like.toPrecision(2);
    temp_max = temp_max.toPrecision(2);
    temp_min = temp_min.toPrecision(2);

    // Update UI elements with weather data
    document.querySelector(
      ".city"
    ).innerHTML = `${cityName}, <span class="font-black">${country}</span>`;
    document.querySelector(
      ".icon"
    ).src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(
      ".temp"
    ).innerHTML = `${temp} <span class="text-2xl font-semibold mt-2">°C</span>`;
    document.querySelector(
      ".feel"
    ).innerHTML = `<span>Feels like </span> ${feels_like}°C`;
    document.querySelector(".max span").innerHTML = `${temp_max}°C`;
    document.querySelector(".min span").innerHTML = `${temp_min}°C`;
    document.querySelector(".humidity span").innerHTML = `${humidity}%`;
    document.querySelector(".wind span").innerHTML = `${windSpeed}k/h`;
    document.querySelector(".visibility span").innerHTML = `${visibility}km`;
    document.querySelector(".pressure span").innerHTML = `${pressure}hPa`;

    // Remove loading state
    document.querySelector(".weather").classList.remove("loading");

    // Update background image if user has interacted with the app
    // if (hasUserInteracted !== 0) {
    //   this.updateBackgroundImage(currentCityName);
    // }
  },

  /**
   * Handle user search input
   * Gets the search value and fetches weather for that city
   */
  handleSearch: function () {
    const searchValue = document.querySelector(".search-bar").value;
    this.fetchWeatherByCity(searchValue.trim());

    // Mark that user has interacted (enable background updates)
    // hasUserInteracted = 1;

    // Show loading state
    document.querySelector(".weather").classList.add("loading");
  },

  /**
   * Update background image based on location
   * Uses different image dimensions based on screen width
   * @param {string} locationName - Name of location for background image search
   */
  updateBackgroundImage: function (imageQuery) {
    console.log(imageQuery);

    // Get Unsplash API key safely
    const unsplashKey =
      (typeof CONFIG !== "undefined" && CONFIG.UNSPLASH_API_KEY) || "";
    if (!unsplashKey) {
      console.warn(
        "Unsplash API key not available, skipping background image update"
      );
      return;
    }

    const imageUrl = `https://api.unsplash.com/photos/random?per_page=1&query=${imageQuery}&client_id=${unsplashKey}&orientation=${
      window.innerWidth > 900 ? "landscape" : "portrait"
    }`;
    // If the screen is wider than 900px, use landscape orientation
    // Otherwise, use portrait orientation

    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch background image");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const imageLink =
          data.urls.regular ||
          data.urls.full ||
          data.urls.raw ||
          data.urls.small;
        document.body.style.backgroundImage = `url('${imageLink}')`;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};

/**
 * Geocoding API handler object
 * Manages location services and reverse geocoding
 */
const geocoding = {
  // OpenCage Geocoding API key - loaded from config (with fallback)
  get apiKey() {
    return (typeof CONFIG !== "undefined" && CONFIG.OPENCAGE_API_KEY) || "";
  },

  /**
   * Convert coordinates to location name and fetch weather
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   */
  reverseGeocode: function (latitude, longitude) {
    // Create the geocoding query from coordinates
    const coordinatesQuery = `${latitude},${longitude}`;

    // Build the API request URL
    const apiUrl = "https://api.opencagedata.com/geocode/v1/json";
    const requestUrl = `${apiUrl}?key=${this.apiKey}&q=${encodeURIComponent(
      coordinatesQuery
    )}&pretty=1&no_annotations=1`;

    // Create and configure the HTTP request
    const request = new XMLHttpRequest();
    request.open("GET", requestUrl, true);

    // Handle the API response
    request.onload = function () {
      if (request.status === 200) {
        // Successfully got location data
        const data = JSON.parse(request.responseText);
        const locationData = data.results[0];

        console.log(locationData);

        // Set background image using state/region name
        // weather.updateBackgroundImage(`
        //   ${
        //     locationData.components.city !== undefined
        //       ? locationData.components.city
        //       : ""
        //   } ${
        //   locationData.components.state !== undefined
        //     ? locationData.components.state
        //     : ""
        // } ${
        //   locationData.components.country !== undefined
        //     ? locationData.components.country
        //     : ""
        // }`);

        // Try to find the most specific location available and fetch weather
        // Priority: town > suburb > city > county > state > coordinates
        const { town, suburb, city, county, state, lat, lng } =
          locationData.components;
        if (town) {
          weather.fetchWeatherByCity(town);
        } else if (suburb) {
          weather.fetchWeatherByCity(suburb);
        } else if (city) {
          weather.fetchWeatherByCity(city);
        } else if (county) {
          weather.fetchWeatherByCity(county);
        } else if (state) {
          weather.fetchWeatherByCity(state);
        } else if (lat && lng) {
          // If no location name available, use coordinates
          weather.fetchWeatherByCoordinates(lat, lng);
        } else {
          // No valid location data found
          alert(`Are you even present here "${locationData.formatted}"?`);
        }

        // Log the current location information
        console.log(
          `Current location: ${locationData.formatted} (${locationData.geometry.lat}, ${locationData.geometry.lng})`
        );
      } else if (request.status <= 500) {
        // Server responded with an error
        console.log(`Unable to geocode! Response code: ${request.status}`);
        const errorData = JSON.parse(request.responseText);
        console.log(`Error message: ${errorData.status.message}`);
      } else {
        // Server error
        console.log("Server error");
      }
    };

    // Handle connection errors
    request.onerror = function () {
      console.log("Unable to connect to server");
    };

    // Send the request
    request.send();
  },

  /**
   * Get user's current location and fetch weather for it
   * Falls back to Kolkata if geolocation is not available
   */
  getCurrentLocation: function () {
    /**
     * Success callback for geolocation
     * @param {GeolocationPosition} position - Position data from browser
     */
    function onLocationSuccess(position) {
      geocoding.reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );
    }

    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        console.error
      );
    } else {
      // Fallback to default city if geolocation is not supported
      weather.fetchWeatherByCity("Kolkata");
    }
  },
};

// ===== EVENT LISTENERS =====

/**
 * Handle search button click
 */
document.querySelector(".search-button").addEventListener("click", function () {
  weather.handleSearch();
});

/**
 * Handle Enter key press in search bar
 */
document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.handleSearch();
    }
  });

// Note: geocoding.getCurrentLocation() is now called from DOMContentLoaded event listener
