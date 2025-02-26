import weatherIcons from "./utils/weatherIcons.js";

const homeImg = document.querySelector("#homeImg");
const homeMunicipality = document.querySelector("#homeMunicipality");
const homeTemperature = document.querySelector("#homeTemperature");
const homeMinTemperature = document.querySelector("#homeMinTemperature");
const homeMaxTemperature = document.querySelector("#homeMaxTemperature");
const homeState = document.querySelector("#homeState");
const homeRainChance = document.querySelector("#homeRainChance");
const homeHumidity = document.querySelector("#homeHumidity");
const homeSunrise = document.querySelector("#homeSunrise");
const homeSunset = document.querySelector("#homeSunset");
const selectHeaderProvince = document.querySelector("#selectHeaderProvince");
const selectHeaderMunicipality = document.querySelector("#selectHeaderMunicipality");

let localHour = "day";
let selectedProvinceCode = localStorage.getItem("selectedProvinceCode");
let selectedMunicipalityCode = localStorage.getItem("selectedMunicipalityCode");

function getLocalHour() {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 20 || hour < 7) {
    localHour = "night";
  }
}

async function getProvinces() {
  try {
    const response = await fetch(
      "https://www.el-tiempo.net/api/json/v2/provincias"
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    data.provincias.forEach(function (provincia) {
      const option = document.createElement("option");
      option.value = provincia.CODPROV;
      option.textContent = provincia.NOMBRE_PROVINCIA;
      selectHeaderProvince.appendChild(option);
    });

    if (selectedProvinceCode !== null) {
      const option = document.querySelector(`option[value="${selectedProvinceCode}"]`);
      if (option) {
        option.selected = true;
        getMunicipalities();
      }
    } else {
      const defaultOption = document.createElement("option");
      defaultOption.value = "default";
      defaultOption.textContent = "Provincia";
      selectHeaderProvince.appendChild(defaultOption);
      defaultOption.selected = true;
    }

  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

selectHeaderProvince.addEventListener("change", function () {
  selectedProvinceCode = selectHeaderProvince.value;
  localStorage.setItem("selectedProvinceCode", selectedProvinceCode);
  getMunicipalities(); 
});

async function getMunicipalities() {
  if (!selectedProvinceCode || selectedProvinceCode === "default") return;

  try {
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    selectHeaderMunicipality.innerHTML = ""; 

    data.municipios.forEach(function (municipio) {
      const option = document.createElement("option");
      let municipalityCodeFull = municipio.CODIGOINE;
      let municipalityCode = municipalityCodeFull.slice(0, 5);
      option.value = municipalityCode;
      option.textContent = municipio.NOMBRE;
      selectHeaderMunicipality.appendChild(option);
    });

    if (selectedMunicipalityCode !== null) {
      const option = document.querySelector(`option[value="${selectedMunicipalityCode}"]`);
      if (option) {
        option.selected = true;
      }
    } else {
      const defaultOption = document.createElement("option");
      defaultOption.value = "default";
      defaultOption.textContent = "Municipio";
      selectHeaderMunicipality.appendChild(defaultOption);
      defaultOption.selected = true;
    }

  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

selectHeaderMunicipality.addEventListener("change", function () {
  selectedMunicipalityCode = selectHeaderMunicipality.value;
  localStorage.setItem("selectedMunicipalityCode", selectedMunicipalityCode);
  getHomeWeather();
});

async function getHomeWeather() {
  try {
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${selectedMunicipalityCode}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    homeMunicipality.textContent = data.municipio.NOMBRE;
    homeTemperature.textContent = `${data.temperatura_actual}°C`;
    homeMinTemperature.textContent = `${data.temperaturas.min}°C`;
    homeMaxTemperature.textContent = `${data.temperaturas.max}°C`;
    homeState.textContent = data.stateSky.description;
    homeRainChance.textContent = data.lluvia === "" ? `0%` : `${data.lluvia}%`;
    homeHumidity.textContent = `${data.humedad}%`;
    homeSunrise.textContent = data.pronostico.hoy["@attributes"].orto;
    homeSunset.textContent = data.pronostico.hoy["@attributes"].ocaso;

    const weatherCondition = data.stateSky.description;
    if (weatherIcons[weatherCondition]) {
      if (localHour === "night") {
        homeImg.src = `./assets/weather-icons/${weatherIcons[weatherCondition]}-${localHour}.png`;
      } else {
        homeImg.src = `./assets/weather-icons/${weatherIcons[weatherCondition][localHour]}`;
      }
    } else {
      homeImg.src = `./assets/weather-icons/sun.png`;
    }
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

getProvinces();
getLocalHour();
getHomeWeather();
