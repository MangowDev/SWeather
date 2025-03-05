import weatherIcons from "./utils/weatherIcons.js";
import provinceCodes from "./utils/provinceCodes.js";

const homeWeatherRow = document.querySelector("#homeWeatherRow");
const upcomingWeatherRow = document.querySelector("#upcomingWeatherRow");
const upcomingDaysRow = document.querySelector("#upcomingDaysRow");
const upcomingHoursRow = document.querySelector("#upcomingHoursRow");
const upcomingHourRow = document.querySelector("#upcomingHourRow");
const nearMunicipalitiesRow = document.querySelector("#nearMunicipalitiesRow");
const nearMunicipalityRow = document.querySelector("#nearMunicipalityRow");
const selectLocationRow = document.querySelector("#selectLocationRow");
const homeDay = document.querySelector("#homeDay");
const homeImg = document.querySelector("#homeImg");
const homeMunicipality = document.querySelector("#homeMunicipality");
const homeTemperature = document.querySelector("#homeTemperature");
const homeMinTemperature = document.querySelector("#homeMinTemperature");
const homeMaxTemperature = document.querySelector("#homeMaxTemperature");
const homeState = document.querySelector("#homeState");
const homeRainChance = document.querySelector("#homeRainChance");
const homeHumidity = document.querySelector("#homeHumidity");
const homeWind = document.querySelector("#homeWind");
const homeSunrise = document.querySelector("#homeSunrise");
const homeSunset = document.querySelector("#homeSunset");
const selectHeaderProvince = document.querySelector("#selectHeaderProvince");
const selectHeaderMunicipality = document.querySelector(
  "#selectHeaderMunicipality"
);
const selectSectionProvince = document.querySelector("#selectSectionProvince");
const selectSectionMunicipality = document.querySelector(
  "#selectSectionMunicipality"
);
const searchLocationButton = document.querySelector("#searchLocationButton");
const allowLocationButton = document.querySelector("#allowLocationButton");
const weatherMap = document.querySelector("#weatherMap");
const mapContainer = document.querySelector("#mapContainer");
const mapProvince = document.querySelector("#mapProvince");
const mapCapital = document.querySelector("#mapCapital");
const mapPopulation = document.querySelector("#mapPopulation");
const mapSurface = document.querySelector("#mapSurface");
const mapPerimeter = document.querySelector("#mapPerimeter");
const mapAltitude = document.querySelector("#mapAltitude");
const mapLatitude = document.querySelector("#mapLatitude");
const mapLongitude = document.querySelector("#mapLongitude");

let localHour = "day";
let selectedProvinceCode = localStorage.getItem("selectedProvinceCode");
let latitude = localStorage.getItem("latitude");
let longitude = localStorage.getItem("longitude");
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
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();

    [selectHeaderProvince, selectSectionProvince].forEach((select) => {
      select.innerHTML = "";
      data.provincias.forEach((provincia) => {
        const option = document.createElement("option");
        option.value = provincia.CODPROV;
        option.textContent = provincia.NOMBRE_PROVINCIA;
        select.appendChild(option);
      });

      const defaultOption = document.createElement("option");
      defaultOption.value = "default";
      defaultOption.textContent = "Provincia";
      select.prepend(defaultOption);
      defaultOption.selected = true;
    });

    if (selectedProvinceCode) {
      selectHeaderProvince.value = selectedProvinceCode;
      selectSectionProvince.value = selectedProvinceCode;
      getMunicipalities();
    }
  } catch (error) {
    console.error("Error obteniendo provincias:", error);
  }
}

[selectHeaderProvince, selectSectionProvince].forEach((select) => {
  select.addEventListener("change", function () {
    selectedProvinceCode = this.value;
    localStorage.setItem("selectedProvinceCode", selectedProvinceCode);

    selectHeaderProvince.value = selectedProvinceCode;
    selectSectionProvince.value = selectedProvinceCode;

    getMunicipalities();
    toggleWeatherRows();
  });
});

async function getMunicipalities() {
  if (!selectedProvinceCode || selectedProvinceCode === "default") return;

  try {
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();

    [selectHeaderMunicipality, selectSectionMunicipality].forEach((select) => {
      select.innerHTML = "";
      data.municipios.forEach((municipio) => {
        const option = document.createElement("option");
        option.value = municipio.CODIGOINE.slice(0, 5);
        option.textContent = municipio.NOMBRE;
        select.appendChild(option);
      });

      const defaultOption = document.createElement("option");
      defaultOption.value = "default";
      defaultOption.textContent = "Municipio";
      select.prepend(defaultOption);
      defaultOption.selected = true;
    });

    if (selectedMunicipalityCode) {
      selectHeaderMunicipality.value = selectedMunicipalityCode;
      selectSectionMunicipality.value = selectedMunicipalityCode;
    }

    return data.municipios;
  } catch (error) {
    console.error("Error obteniendo municipios:", error);
  }
}

[selectHeaderMunicipality, selectSectionMunicipality].forEach((select) => {
  select.addEventListener("change", function () {
    if (select === selectHeaderMunicipality) {
      selectedMunicipalityCode = this.value;
      localStorage.setItem(
        "selectedMunicipalityCode",
        selectedMunicipalityCode
      );
    }

    selectHeaderMunicipality.value = this.value;
    selectSectionMunicipality.value = this.value;

    toggleWeatherRows();
  });
});

searchLocationButton.addEventListener("click", function () {
  selectedMunicipalityCode = selectSectionMunicipality.value;
  localStorage.setItem("selectedMunicipalityCode", selectedMunicipalityCode);

  selectHeaderMunicipality.value = selectedMunicipalityCode;
  selectSectionMunicipality.value = selectedMunicipalityCode;

  toggleWeatherRows();
});

async function getHomeWeather() {
  if (
    !selectedProvinceCode ||
    !selectedMunicipalityCode ||
    selectedProvinceCode === "default" ||
    selectedMunicipalityCode === "default"
  ) {
    console.warn(
      "No hay provincia o municipio seleccionado. No se puede obtener el clima."
    );
    return;
  }

  try {
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${selectedMunicipalityCode}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    homeMunicipality.textContent = data.municipio.NOMBRE;
    homeDay.textContent = formatDate(data.fecha);
    homeTemperature.textContent = `${data.temperatura_actual}°C`;
    homeMinTemperature.textContent = `${data.temperaturas.min}°C`;
    homeMaxTemperature.textContent = `${data.temperaturas.max}°C`;
    homeState.textContent = data.stateSky.description;
    homeRainChance.textContent = data.lluvia ? `${data.lluvia}%` : "0%";
    homeHumidity.textContent = `${data.humedad}%`;
    homeWind.textContent = `${data.viento} Km/s`;
    homeSunrise.textContent = data.pronostico.hoy["@attributes"].orto;
    homeSunset.textContent = data.pronostico.hoy["@attributes"].ocaso;
    latitude = data.municipio.LATITUD_ETRS89_REGCAN95;
    longitude = data.municipio.LONGITUD_ETRS89_REGCAN95;
    mapProvince.textContent = data.municipio.NOMBRE_PROVINCIA;
    mapCapital.textContent = data.municipio.NOMBRE_CAPITAL;
    mapPopulation.textContent = data.municipio.POBLACION_MUNI;
    mapSurface.textContent = `${data.municipio.SUPERFICIE} Km²`;
    mapPerimeter.textContent = `${data.municipio.PERIMETRO} Km`;
    mapAltitude.textContent = `${data.municipio.ALTITUD} msnm`;
    mapLatitude.textContent = latitude;
    mapLongitude.textContent = longitude;

    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

    getLocation();

    const weatherCondition = data.stateSky.description;
    homeImg.src = weatherIcons[weatherCondition]
      ? `./assets/weather-icons/${weatherIcons[weatherCondition][localHour]}`
      : "./assets/weather-icons/sun.png";
  } catch (error) {
    console.error("Error obteniendo el clima:", error);
  }
}

async function getUpcomingHours() {
  if (
    !selectedProvinceCode ||
    !selectedMunicipalityCode ||
    selectedProvinceCode === "default" ||
    selectedMunicipalityCode === "default"
  ) {
    console.warn(
      "No hay provincia o municipio seleccionado. No se puede obtener el clima."
    );
    return;
  }

  try {
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${selectedMunicipalityCode}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    const upcomingHours = data.pronostico.hoy;
    upcomingHourRow.innerHTML = "";

    const date = new Date();
    let hourTime = date.getHours();
    let hourState = "day";
    const windData = data.pronostico.hoy.viento;

    upcomingHours.temperatura.forEach((temp, index) => {
      const upcomingHourTime = hourTime + index + 1;

      if (upcomingHourTime >= 20 || upcomingHourTime < 7) {
        hourState = "night";
      }

      if (upcomingHourTime > 23) return;

      const estadoCielo =
        upcomingHours.estado_cielo_descripcion[index] || "Despejado";

      const rainChance = upcomingHours.precipitacion[index] || "0";

      const wind = windData.find(
        (w) => parseInt(w["@attributes"].periodo) === upcomingHourTime
      );
      const windSpeed = wind ? wind.velocidad : "N/A";

      const hourElement = document.createElement("div");
      hourElement.classList.add(
        "col-lg-3",
        "col-12",
        "gap-3",
        "justify-content-center",
        "text-center",
        "align-items-center",
        "d-flex",
        "flex-column",
        "upcoming-hour-column"
      );

      const weatherIcon = weatherIcons[estadoCielo]
        ? `./assets/weather-icons/${weatherIcons[estadoCielo][hourState]}`
        : "./assets/weather-icons/sun.png";

      hourElement.innerHTML = `
        <h4>${upcomingHourTime}:00</h4>
        <div class="col-12 gap-3 justify-content-center text-center align-items-center d-flex flex-column">
          <img src="${weatherIcon}" alt="upcoming-weather-icon" />
          <h5>${temp}°C</h5>
          <div class="hour-info"><img src="../assets/weather-icons/raindrop.png" alt="raindrop"><h5>${rainChance}%</h5></div>
          <div class="hour-info"><img src="../assets/weather-icons/wind.png" alt="wind"><h5>${windSpeed} km/h</h5></div>
        </div>
      `;

      upcomingHourRow.appendChild(hourElement);
    });
  } catch (error) {
    console.error("Error obteniendo el clima:", error);
  }
}

async function getUpcomingDays() {
  if (
    !selectedProvinceCode ||
    !selectedMunicipalityCode ||
    selectedProvinceCode === "default" ||
    selectedMunicipalityCode === "default"
  ) {
    console.warn(
      "No hay provincia o municipio seleccionado. No se puede obtener el clima."
    );
    return;
  }

  try {
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${selectedMunicipalityCode}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    const upcomingDays = data.proximos_dias;

    upcomingDaysRow.innerHTML = "";

    upcomingDays.forEach((day) => {
      const date = day["@attributes"].fecha;

      const skyState = Array.isArray(day.estado_cielo_descripcion)
        ? day.estado_cielo_descripcion[0]
        : day.estado_cielo_descripcion;

      const minTemp = day.temperatura.minima;
      const maxTemp = day.temperatura.maxima;

      const dayElement = document.createElement("div");
      dayElement.classList.add(
        "col-lg-3",
        "col-12",
        "gap-3",
        "justify-content-center",
        "text-center",
        "align-items-center",
        "d-flex",
        "flex-column",
        "upcoming-day-column"
      );

      const weatherIcon = weatherIcons[skyState]
        ? `./assets/weather-icons/${weatherIcons[skyState][localHour]}`
        : "./assets/weather-icons/sun.png";

      dayElement.innerHTML = `
        <h4>${formatDate(date)}</h4>
        <div class="col-12 gap-3 justify-content-center text-center align-items-center d-flex flex-column">
          <img src="${weatherIcon}" alt="upcoming-weather-icon" />
          <h5>${skyState}</h5>
        </div>
        <div class="col-12 gap-3 justify-content-center text-center align-items-center d-flex flex-row upcoming-min-max-div">
          <span>Min: <b>${minTemp}º</b></span>
          <div class="upcoming-separation-div"></div>
          <span>Max: <b>${maxTemp}º</b></span>
        </div>
      `;

      upcomingDaysRow.appendChild(dayElement);
    });
  } catch (error) {
    console.error("Error obteniendo el clima:", error);
  }
}

async function getNearMunicipalities() {
  if (
    !selectedProvinceCode ||
    !selectedMunicipalityCode ||
    selectedProvinceCode === "default" ||
    selectedMunicipalityCode === "default"
  ) {
    console.warn(
      "No hay provincia o municipio seleccionado. No se puede obtener el clima."
    );
    return;
  }

  try {
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    const allMunicipalities = data.municipios;

    nearMunicipalityRow.innerHTML = "";

    let filteredMunicipalities = [];

    const sortedMunicipalities = allMunicipalities.sort(
      (a, b) => b.POBLACION_MUNI - a.POBLACION_MUNI
    );

    sortedMunicipalities.forEach((municipality, index) => {
      if (index < 6) {
        filteredMunicipalities.push(municipality);
      }
    });

    filteredMunicipalities.forEach((municipality) => {
      const municipalityCode = municipality.CODIGOINE.slice(0, 5);
      (async () => {
        try {
          const response = await fetch(
            `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${municipalityCode}`
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          const municipalityData = await response.json();

          if (!municipalityData) {
            console.warn(
              `No hay datos de clima para ${municipality.municipio.NOMBRE}`
            );
            return;
          }

          const municipalityName = municipalityData.municipio.NOMBRE;
          const skyState = municipalityData.stateSky.description;

          const minTemp = municipalityData.temperaturas.min;
          const maxTemp = municipalityData.temperaturas.max;

          const municipalityElement = document.createElement("div");
          municipalityElement.classList.add(
            "col-lg-3",
            "col-12",
            "gap-3",
            "justify-content-center",
            "text-center",
            "align-items-center",
            "d-flex",
            "flex-column",
            "near-municipality-column"
          );

          const weatherIcon = weatherIcons[skyState]
            ? `./assets/weather-icons/${weatherIcons[skyState][localHour]}`
            : "./assets/weather-icons/sun.png";

          municipalityElement.innerHTML = `
            <h4>${municipalityName}</h4>
            <div class="col-12 gap-3 justify-content-center text-center align-items-center d-flex flex-column">
              <img src="${weatherIcon}" alt="upcoming-weather-icon" />
              <h5>${skyState}</h5>
            </div>
            <div class="col-12 gap-3 justify-content-center text-center align-items-center d-flex flex-row upcoming-min-max-div">
              <span>Min: <b>${minTemp}º</b></span>
              <div class="upcoming-separation-div"></div>
              <span>Max: <b>${maxTemp}º</b></span>
            </div>
          `;

          nearMunicipalityRow.appendChild(municipalityElement);
        } catch (error) {
          console.error(
            `Error obteniendo el clima de ${municipality.municipio.NOMBRE}:`,
            error
          );
        }
      })();
    });
  } catch (error) {
    console.error("Error obteniendo el clima:", error);
  }
}

function toggleWeatherRows() {
  if (
    selectedProvinceCode &&
    selectedMunicipalityCode &&
    selectedProvinceCode !== "default" &&
    selectedMunicipalityCode !== "default"
  ) {
    homeWeatherRow.style.display = "flex";
    homeWeatherRow.classList.add("d-flex");
    upcomingHoursRow.style.display = "flex";
    upcomingHoursRow.classList.add("d-flex");
    upcomingWeatherRow.style.display = "flex";
    upcomingWeatherRow.classList.add("d-flex");
    nearMunicipalitiesRow.style.display = "flex";
    nearMunicipalitiesRow.classList.add("d-flex");
    mapContainer.style.display = "flex";
    mapContainer.classList.add("d-flex");
    selectLocationRow.style.display = "none";
    selectLocationRow.classList.remove("d-flex");
    getHomeWeather();
    getUpcomingHours();
    getUpcomingDays();
    getNearMunicipalities();
  } else {
    homeWeatherRow.style.display = "none";
    homeWeatherRow.classList.remove("d-flex");
    upcomingHoursRow.style.display = "none";
    upcomingHoursRow.classList.remove("d-flex");
    upcomingWeatherRow.style.display = "none";
    upcomingWeatherRow.classList.remove("d-flex");
    nearMunicipalitiesRow.style.display = "none";
    nearMunicipalitiesRow.classList.remove("d-flex");
    mapContainer.style.display = "none";
    mapContainer.classList.remove("d-flex");
    selectLocationRow.style.display = "none";
    selectLocationRow.style.display = "flex";
    selectLocationRow.classList.add("d-flex");
  }
}

allowLocationButton.addEventListener("click", function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
        await getPreciseLocation();
      },
      function (error) {
        console.log("Error obteniendo la ubicación: ", error);
        alert("No se pudo obtener la ubicación.");
      }
    );
  } else {
    alert("Geolocalización no disponible en este navegador.");
  }
});

function getLocation() {
  latitude = parseFloat(localStorage.getItem("latitude"));
  longitude = parseFloat(localStorage.getItem("longitude"));

  if (!latitude || !longitude) {
    console.warn("La ubicación no esta disponible.");
    return;
  }

  weatherMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.05
  },${latitude - 0.05},${longitude + 0.05},${
    latitude + 0.05
  }&layer=mapnik&marker=${latitude},${longitude}`;
}

async function getPreciseLocation() {
  const latitude = parseFloat(localStorage.getItem("latitude"));
  const longitude = parseFloat(localStorage.getItem("longitude"));

  if (!latitude || !longitude) {
    console.warn("La ubicación no está disponible.");
    return;
  }

  weatherMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.05
  },${latitude - 0.05},${longitude + 0.05},${
    latitude + 0.05
  }&layer=mapnik&marker=${latitude},${longitude}`;

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      const province = data.address.province;
      if (province) {
        const provinceCode = provinceCodes[province];
        if (provinceCode) {
          selectedProvinceCode = provinceCode;
          localStorage.setItem("selectedProvinceCode", selectedProvinceCode);

          selectHeaderProvince.value = selectedProvinceCode;
          selectSectionProvince.value = selectedProvinceCode;

          await getMunicipalityByLocation();

          selectHeaderMunicipality.value = selectedMunicipalityCode;
          selectSectionMunicipality.value = selectedMunicipalityCode;

          toggleWeatherRows();
        } else {
          console.warn("Código de provincia no encontrado.");
        }
      } else {
        console.warn("No se pudo obtener la provincia.");
      }
    } else {
      console.warn("No se pudo obtener la provincia.");
    }
  } catch (error) {
    console.error("Error al obtener la provincia:", error);
  }
}

async function getMunicipalityByLocation() {
  try {
    const municipalities = await getMunicipalities();
    if (!municipalities) return;

    const locationLat = parseFloat(localStorage.getItem("latitude"));
    const locationLon = parseFloat(localStorage.getItem("longitude"));

    let distances = [];
    municipalities.forEach((municipio) => {
      const municipioLat = parseFloat(municipio.LATITUD_ETRS89_REGCAN95);
      const municipioLon = parseFloat(municipio.LONGITUD_ETRS89_REGCAN95);

      const distance = haversine(
        municipioLat,
        municipioLon,
        locationLat,
        locationLon
      );

      distances.push({
        distance: distance,
        municipalityCode: municipio.CODIGOINE.slice(0, 5)
      });
    });

    const closest = distances.reduce((min, curr) => 
      curr.distance < min.distance ? curr : min, { distance: Infinity });

    selectedMunicipalityCode = closest.municipalityCode;
    localStorage.setItem("selectedMunicipalityCode", selectedMunicipalityCode);

    selectHeaderMunicipality.value = selectedMunicipalityCode;
    selectSectionMunicipality.value = selectedMunicipalityCode;

  } catch (error) {
    console.error("Error al obtener municipios cercanos:", error);
  }
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


function formatDate(fecha) {
  const date = new Date(fecha);
  const options = { weekday: "short", day: "numeric", month: "long" };
  return date.toLocaleDateString("es-ES", options);
}

getProvinces();
getLocalHour();
toggleWeatherRows();
getLocation();
