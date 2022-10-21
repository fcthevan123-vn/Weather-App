// Set Variables
const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  getLocationBtn = inputPart.querySelector("button"),
  imgIcon = document.querySelector(".weather-part img"),
  backBtn = wrapper.querySelector("header i");

console.log(backBtn);
let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value.length > 0) {
    requestApi(inputField.value);
  }
});

getLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    //Check if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation. Please try again later.");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords; //Get latitude and longitude from coords object
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=be71fb2faf9aa474a946505ea4964ee8`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(yourCity) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${yourCity}&units=metric&appid=be71fb2faf9aa474a946505ea4964ee8`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather information...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json()) // return a promise called response, after use JSON.parse to convert JSON to Javascript
    .then((result) => weatherDetails(result)); // calling weatherDetails function with result as an agrument
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
  } else {
    // get value form the info object
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // modify img weather follow id
    if (id == 800) {
      imgIcon.src = "/assets/icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      imgIcon.src = "/assets/icons/storm.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      imgIcon.src = "/assets/icons/rain.svg";
    } else if (id >= 600 && id <= 622) {
      imgIcon.src = "/assets/icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      imgIcon.src = "/assets/icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      imgIcon.src = "/assets/icons/cloud.svg";
    }

    // pass these values to html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending");
    wrapper.classList.add("active");

    // back to homepage
    backBtn.addEventListener("click", () => {
      wrapper.classList.remove("active");
      infoTxt.classList.remove("error");
    });
  }
}
