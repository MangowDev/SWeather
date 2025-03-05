// Importamos los iconos del clima y los códigos de provincias desde archivos externos
import weatherIcons from "./utils/weatherIcons.js";
import provinceCodes from "./utils/provinceCodes.js";

// Selección de elementos HTML que vamos a manipular
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

// Inicialización de variables con valores almacenados en el localStorage
let localHour = "day"; // Hora del día (por defecto "day")
let selectedProvinceCode = localStorage.getItem("selectedProvinceCode"); // Código de la provincia seleccionado
let latitude = localStorage.getItem("latitude"); // Latitud de la ubicación
let longitude = localStorage.getItem("longitude"); // Longitud de la ubicación
let selectedMunicipalityCode = localStorage.getItem("selectedMunicipalityCode"); // Código del municipio seleccionado

// Función asíncrona para obtener las provincias desde la API
async function getProvinces() {
  try {
    // Hacemos una petición GET para obtener las provincias
    const response = await fetch(
      "https://www.el-tiempo.net/api/json/v2/provincias"
    );
    // Si la respuesta no es correcta, lanzamos un error
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    // Parseamos la respuesta a formato JSON
    const data = await response.json();

    // Llenamos los select de provincias con las opciones obtenidas
    [selectHeaderProvince, selectSectionProvince].forEach((select) => {
      select.innerHTML = ""; // Limpiamos las opciones existentes

      // Por cada provincia, creamos un elemento option y lo añadimos al select
      data.provincias.forEach((provincia) => {
        const option = document.createElement("option");
        option.value = provincia.CODPROV; // Código de la provincia
        option.textContent = provincia.NOMBRE_PROVINCIA; // Nombre de la provincia
        select.appendChild(option);
      });

      // Creamos una opción por defecto para el select
      const defaultOption = document.createElement("option");
      defaultOption.value = "default";
      defaultOption.textContent = "Provincia";
      select.prepend(defaultOption); // Añadimos la opción por defecto al principio
      defaultOption.selected = true; // Marcamos la opción por defecto como seleccionada
    });

    // Si ya hay una provincia seleccionada, la asignamos a los selects
    if (selectedProvinceCode) {
      selectHeaderProvince.value = selectedProvinceCode;
      selectSectionProvince.value = selectedProvinceCode;
      getMunicipalities(); // Obtenemos los municipios para esa provincia
    }
  } catch (error) {
    // Mostramos el error en caso de fallo
    console.error("Error obteniendo provincias:", error);
  }
}

// Event listener para cuando cambia la provincia en los selects
[selectHeaderProvince, selectSectionProvince].forEach((select) => {
  select.addEventListener("change", function () {
    selectedProvinceCode = this.value; // Actualizamos el código de la provincia seleccionada
    localStorage.setItem("selectedProvinceCode", selectedProvinceCode); // Guardamos el código de provincia en el localStorage

    selectHeaderProvince.value = selectedProvinceCode; // Actualizamos el valor del select
    selectSectionProvince.value = selectedProvinceCode; // Actualizamos el valor del select

    getMunicipalities(); // Obtenemos los municipios de la provincia seleccionada
    toggleWeatherRows(); // Actualizamos las filas de la interfaz según los cambios
  });
});

// Función asíncrona para obtener los municipios de la provincia seleccionada
async function getMunicipalities() {
  if (!selectedProvinceCode || selectedProvinceCode === "default") return; // Si no se ha seleccionado provincia, salimos de la función

  try {
    // Hacemos una petición GET para obtener los municipios de la provincia seleccionada
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();

    // Llenamos los select de municipios con las opciones obtenidas
    [selectHeaderMunicipality, selectSectionMunicipality].forEach((select) => {
      select.innerHTML = ""; // Limpiamos las opciones existentes

      // Por cada municipio, creamos un elemento option y lo añadimos al select
      data.municipios.forEach((municipio) => {
        const option = document.createElement("option");
        option.value = municipio.CODIGOINE.slice(0, 5); // Usamos los primeros 5 caracteres del código de municipio
        option.textContent = municipio.NOMBRE; // Nombre del municipio
        select.appendChild(option);
      });

      // Creamos una opción por defecto para el select
      const defaultOption = document.createElement("option");
      defaultOption.value = "default";
      defaultOption.textContent = "Municipio";
      select.prepend(defaultOption); // Añadimos la opción por defecto al principio
      defaultOption.selected = true; // Marcamos la opción por defecto como seleccionada
    });

    // Si ya hay un municipio seleccionado, lo asignamos a los selects
    if (selectedMunicipalityCode) {
      selectHeaderMunicipality.value = selectedMunicipalityCode;
      selectSectionMunicipality.value = selectedMunicipalityCode;
    }

    return data.municipios;
  } catch (error) {
    // Mostramos el error en caso de fallo
    console.error("Error obteniendo municipios:", error);
  }
}

// Event listener para cuando cambia el municipio en los selects
[selectHeaderMunicipality, selectSectionMunicipality].forEach((select) => {
  select.addEventListener("change", function () {
    if (select === selectHeaderMunicipality) {
      selectedMunicipalityCode = this.value; // Actualizamos el código del municipio seleccionado
      localStorage.setItem(
        "selectedMunicipalityCode",
        selectedMunicipalityCode
      ); // Guardamos el código de municipio en el localStorage
    }

    selectHeaderMunicipality.value = this.value; // Actualizamos el valor del select
    selectSectionMunicipality.value = this.value; // Actualizamos el valor del select

    toggleWeatherRows(); // Actualizamos las filas de la interfaz según los cambios
  });
});

// Event listener para el botón de búsqueda de ubicación
searchLocationButton.addEventListener("click", function () {
  selectedMunicipalityCode = selectSectionMunicipality.value; // Obtenemos el municipio seleccionado
  localStorage.setItem("selectedMunicipalityCode", selectedMunicipalityCode); // Guardamos el código de municipio en el localStorage

  selectHeaderMunicipality.value = selectedMunicipalityCode; // Actualizamos el valor del select
  selectSectionMunicipality.value = selectedMunicipalityCode; // Actualizamos el valor del select

  toggleWeatherRows(); // Actualizamos las filas de la interfaz según los cambios
});

// Función asíncrona para obtener el clima del municipio seleccionado
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
    return; // Si no se ha seleccionado una provincia o municipio, mostramos una advertencia y salimos
  }

  try {
    // Hacemos una petición GET para obtener el clima del municipio seleccionado
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${selectedMunicipalityCode}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`); // Si la respuesta no es correcta, lanzamos un error
    const data = await response.json(); // Parseamos la respuesta a formato JSON

    // Actualizamos la interfaz con la información del clima obtenida
    homeMunicipality.textContent = data.municipio.NOMBRE; // Nombre del municipio
    homeDay.textContent = formatDate(data.fecha); // Fecha del clima
    homeTemperature.textContent = `${data.temperatura_actual}°C`; // Temperatura actual
    homeMinTemperature.textContent = `${data.temperaturas.min}°C`; // Temperatura mínima
    homeMaxTemperature.textContent = `${data.temperaturas.max}°C`; // Temperatura máxima
    homeState.textContent = data.stateSky.description; // Estado del cielo (descripción)
    homeRainChance.textContent = data.lluvia ? `${data.lluvia}%` : "0%"; // Probabilidad de lluvia
    homeHumidity.textContent = `${data.humedad}%`; // Humedad
    homeWind.textContent = `${data.viento} Km/s`; // Velocidad del viento
    homeSunrise.textContent = data.pronostico.hoy["@attributes"].orto; // Hora del amanecer
    homeSunset.textContent = data.pronostico.hoy["@attributes"].ocaso; // Hora del atardecer
    latitude = data.municipio.LATITUD_ETRS89_REGCAN95; // Latitud
    longitude = data.municipio.LONGITUD_ETRS89_REGCAN95; // Longitud

    // Actualizamos la información del mapa
    mapProvince.textContent = data.municipio.NOMBRE_PROVINCIA;
    mapCapital.textContent = data.municipio.NOMBRE_CAPITAL;
    mapPopulation.textContent = data.municipio.POBLACION_MUNI;
    mapSurface.textContent = `${data.municipio.SUPERFICIE} Km²`;
    mapPerimeter.textContent = `${data.municipio.PERIMETRO} Km`;
    mapAltitude.textContent = `${data.municipio.ALTITUD} msnm`;
    mapLatitude.textContent = latitude;
    mapLongitude.textContent = longitude;

    // Guardamos la latitud y longitud en el localStorage para futuras consultas
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

    // Llamamos a la función para obtener la ubicación
    getLocation();

    // Asignamos el icono del clima según la descripción obtenida
    const weatherCondition = data.stateSky.description;
    homeImg.src = weatherIcons[weatherCondition]
      ? `./assets/weather-icons/${weatherIcons[weatherCondition][localHour]}`
      : "./assets/weather-icons/sun.png"; // Si no se encuentra el icono, usamos un icono por defecto
  } catch (error) {
    // Mostramos el error en caso de fallo
    console.error("Error obteniendo el clima:", error);
  }
}

// Función asíncrona para obtener el pronóstico de las próximas horas
async function getUpcomingHours() {
  // Comprobamos que haya una provincia y municipio seleccionados
  if (
    !selectedProvinceCode ||
    !selectedMunicipalityCode ||
    selectedProvinceCode === "default" ||
    selectedMunicipalityCode === "default"
  ) {
    console.warn(
      "No hay provincia o municipio seleccionado. No se puede obtener el clima."
    );
    return; // Si no se han seleccionado provincia o municipio, no hacemos la solicitud
  }

  try {
    // Hacemos la solicitud para obtener los datos del clima de la provincia y municipio seleccionados
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${selectedMunicipalityCode}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`); // Verificamos que la respuesta sea correcta
    const data = await response.json(); // Parseamos los datos de la respuesta

    const upcomingHours = data.pronostico.hoy; // Obtenemos las horas de pronóstico
    upcomingHourRow.innerHTML = ""; // Limpiamos la fila de las horas previas

    const date = new Date(); // Obtenemos la fecha y hora actual
    let hourTime = date.getHours(); // Extraemos la hora actual
    let hourState = "day"; // Establecemos el estado de la hora como 'day' (día)
    const windData = data.pronostico.hoy.viento; // Datos del viento

    // Iteramos por las temperaturas de las próximas horas
    upcomingHours.temperatura.forEach((temp, index) => {
      const upcomingHourTime = hourTime + index + 1; // Calculamos la hora siguiente

      // Determinamos si la hora es de noche (si es mayor o igual a las 20:00 o menor a las 7:00)
      if (upcomingHourTime >= 20 || upcomingHourTime < 7) {
        hourState = "night";
      }

      // Si la hora supera las 23, no la procesamos
      if (upcomingHourTime > 23) return;

      // Obtenemos el estado del cielo (si no existe, asignamos 'Despejado')
      const estadoCielo =
        upcomingHours.estado_cielo_descripcion[index] || "Despejado";

      // Obtenemos la probabilidad de lluvia (si no existe, asignamos '0')
      const rainChance = upcomingHours.precipitacion[index] || "0";

      // Buscamos los datos del viento para la hora actual
      const wind = windData.find(
        (w) => parseInt(w["@attributes"].periodo) === upcomingHourTime
      );
      const windSpeed = wind ? wind.velocidad : "N/A"; // Si hay datos de viento, usamos su velocidad, si no, mostramos 'N/A'

      // Creamos un contenedor para cada hora próxima
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

      // Obtenemos el icono correspondiente al estado del cielo
      const weatherIcon = weatherIcons[estadoCielo]
        ? `./assets/weather-icons/${weatherIcons[estadoCielo][hourState]}`
        : "./assets/weather-icons/sun.png"; // Si no hay icono para ese estado, usamos un icono por defecto

      // Asignamos el contenido HTML para cada hora
      hourElement.innerHTML = `
        <h4>${upcomingHourTime}:00</h4>
        <div class="col-12 gap-3 justify-content-center text-center align-items-center d-flex flex-column">
          <img src="${weatherIcon}" alt="upcoming-weather-icon" />
          <h5>${temp}°C</h5>
          <div class="hour-info"><img src="./assets/weather-icons/raindrop.png" alt="raindrop"><h5>${rainChance}%</h5></div>
          <div class="hour-info"><img src="./assets/weather-icons/wind.png" alt="wind"><h5>${windSpeed} km/h</h5></div>
        </div>
      `;

      // Añadimos el elemento de la hora próxima al contenedor
      upcomingHourRow.appendChild(hourElement);
    });
  } catch (error) {
    // En caso de error, mostramos un mensaje en la consola
    console.error("Error obteniendo el clima:", error);
  }
}

// Función asíncrona para obtener el pronóstico de los próximos días
async function getUpcomingDays() {
  // Comprobamos que haya una provincia y municipio seleccionados
  if (
    !selectedProvinceCode ||
    !selectedMunicipalityCode ||
    selectedProvinceCode === "default" ||
    selectedMunicipalityCode === "default"
  ) {
    console.warn(
      "No hay provincia o municipio seleccionado. No se puede obtener el clima."
    );
    return; // Si no se han seleccionado provincia o municipio, no hacemos la solicitud
  }

  try {
    // Hacemos la solicitud para obtener los datos del clima de la provincia y municipio seleccionados
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${selectedMunicipalityCode}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`); // Verificamos que la respuesta sea correcta
    const data = await response.json(); // Parseamos los datos de la respuesta

    const upcomingDays = data.proximos_dias; // Obtenemos el pronóstico para los próximos días

    upcomingDaysRow.innerHTML = ""; // Limpiamos la fila de los próximos días

    // Iteramos por cada uno de los próximos días
    upcomingDays.forEach((day) => {
      const date = day["@attributes"].fecha; // Fecha del día

      // Obtenemos el estado del cielo (si es un array, tomamos el primero)
      const skyState = Array.isArray(day.estado_cielo_descripcion)
        ? day.estado_cielo_descripcion[0]
        : day.estado_cielo_descripcion;

      const minTemp = day.temperatura.minima; // Temperatura mínima
      const maxTemp = day.temperatura.maxima; // Temperatura máxima

      // Creamos un contenedor para cada día
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

      // Obtenemos el icono correspondiente al estado del cielo
      const weatherIcon = weatherIcons[skyState]
        ? `./assets/weather-icons/${weatherIcons[skyState][localHour]}`
        : "./assets/weather-icons/sun.png"; // Si no hay icono para ese estado, usamos un icono por defecto

      // Asignamos el contenido HTML para cada día
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

      // Añadimos el elemento del día al contenedor
      upcomingDaysRow.appendChild(dayElement);
    });
  } catch (error) {
    // En caso de error, mostramos un mensaje en la consola
    console.error("Error obteniendo el clima:", error);
  }
}

// Función asíncrona para obtener los municipios cercanos
async function getNearMunicipalities() {
  // Comprobamos que haya una provincia y municipio seleccionados
  if (
    !selectedProvinceCode ||
    !selectedMunicipalityCode ||
    selectedProvinceCode === "default" ||
    selectedMunicipalityCode === "default"
  ) {
    console.warn(
      "No hay provincia o municipio seleccionado. No se puede obtener el clima."
    );
    return; // Si no se han seleccionado provincia o municipio, no hacemos la solicitud
  }

  try {
    // Hacemos la solicitud para obtener los municipios de la provincia seleccionada
    const response = await fetch(
      `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`); // Verificamos que la respuesta sea correcta
    const data = await response.json(); // Parseamos los datos de la respuesta

    const allMunicipalities = data.municipios; // Obtenemos todos los municipios

    nearMunicipalityRow.innerHTML = ""; // Limpiamos la fila de municipios cercanos

    let filteredMunicipalities = []; // Lista para almacenar los municipios filtrados

    // Ordenamos los municipios por población de mayor a menor
    const sortedMunicipalities = allMunicipalities.sort(
      (a, b) => b.POBLACION_MUNI - a.POBLACION_MUNI
    );

    // Filtramos los primeros 6 municipios más poblados
    sortedMunicipalities.forEach((municipality, index) => {
      if (index < 6) {
        filteredMunicipalities.push(municipality);
      }
    });

    // Iteramos por los municipios filtrados para mostrar su clima
    filteredMunicipalities.forEach((municipality) => {
      const municipalityCode = municipality.CODIGOINE.slice(0, 5); // Extraemos el código del municipio

      // Hacemos la solicitud para obtener el clima de cada municipio
      (async () => {
        try {
          const response = await fetch(
            `https://www.el-tiempo.net/api/json/v2/provincias/${selectedProvinceCode}/municipios/${municipalityCode}`
          );
          if (!response.ok) throw new Error(`Error: ${response.status}`); // Verificamos que la respuesta sea correcta
          const municipalityData = await response.json(); // Parseamos los datos del municipio

          if (!municipalityData) {
            console.warn(
              `No hay datos de clima para ${municipality.municipio.NOMBRE}`
            );
            return; // Si no hay datos de clima, mostramos un aviso
          }

          const municipalityName = municipalityData.municipio.NOMBRE; // Nombre del municipio
          const skyState = municipalityData.stateSky.description; // Estado del cielo

          const minTemp = municipalityData.temperaturas.min; // Temperatura mínima
          const maxTemp = municipalityData.temperaturas.max; // Temperatura máxima

          // Creamos un contenedor para el municipio cercano
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

          // Obtenemos el icono correspondiente al estado del cielo
          const weatherIcon = weatherIcons[skyState]
            ? `./assets/weather-icons/${weatherIcons[skyState][localHour]}`
            : "./assets/weather-icons/sun.png"; // Si no hay icono para ese estado, usamos un icono por defecto

          // Asignamos el contenido HTML para el municipio
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

          // Añadimos el elemento del municipio cercano al contenedor
          nearMunicipalityRow.appendChild(municipalityElement);
        } catch (error) {
          // En caso de error, mostramos un mensaje en la consola
          console.error(
            `Error obteniendo el clima de ${municipality.municipio.NOMBRE}:`,
            error
          );
        }
      })();
    });
  } catch (error) {
    // En caso de error, mostramos un mensaje en la consola
    console.error("Error obteniendo el clima:", error);
  }
}

// Función que controla la visibilidad de las filas de clima según si se ha seleccionado una provincia y municipio
function toggleWeatherRows() {
  // Verificamos si la provincia y municipio seleccionados son válidos
  if (
    selectedProvinceCode &&
    selectedMunicipalityCode &&
    selectedProvinceCode !== "default" &&
    selectedMunicipalityCode !== "default"
  ) {
    // Si se ha seleccionado una provincia y municipio válidos, mostramos las filas de clima
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

    // Ocultamos la fila de selección de ubicación
    selectLocationRow.style.display = "none";
    selectLocationRow.classList.remove("d-flex");

    // Llamamos a las funciones para obtener el clima
    getHomeWeather();
    getUpcomingHours();
    getUpcomingDays();
    getNearMunicipalities();
  } else {
    // Si no hay una provincia y municipio seleccionados, ocultamos las filas de clima
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

    // Mostramos la fila de selección de ubicación
    selectLocationRow.style.display = "none";
    selectLocationRow.style.display = "flex";
    selectLocationRow.classList.add("d-flex");
  }
}

// Función que se ejecuta al hacer clic en el botón de ubicación
allowLocationButton.addEventListener("click", function () {
  // Verificamos si el navegador soporta geolocalización
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        // Si se obtiene la ubicación, la almacenamos en localStorage
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
        
        // Llamamos a la función para obtener la ubicación precisa
        await getPreciseLocation();
      },
      function (error) {
        // Si ocurre un error al obtener la ubicación, mostramos un mensaje
        console.log("Error obteniendo la ubicación: ", error);
        alert("No se pudo obtener la ubicación.");
      }
    );
  } else {
    // Si la geolocalización no está disponible en el navegador, mostramos un mensaje
    alert("Geolocalización no disponible en este navegador.");
  }
});

// Función para obtener la ubicación almacenada en localStorage
function getLocation() {
  // Recuperamos las coordenadas de latitud y longitud desde localStorage
  latitude = parseFloat(localStorage.getItem("latitude"));
  longitude = parseFloat(localStorage.getItem("longitude"));

  // Si no tenemos coordenadas, mostramos un mensaje de advertencia
  if (!latitude || !longitude) {
    console.warn("La ubicación no esta disponible.");
    return;
  }

  // Actualizamos el mapa con la ubicación almacenada
  weatherMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.05
  },${latitude - 0.05},${longitude + 0.05},${
    latitude + 0.05
  }&layer=mapnik&marker=${latitude},${longitude}`;
}

// Función para obtener la ubicación precisa usando OpenStreetMap
async function getPreciseLocation() {
  const latitude = parseFloat(localStorage.getItem("latitude"));
  const longitude = parseFloat(localStorage.getItem("longitude"));

  // Verificamos que tengamos coordenadas válidas
  if (!latitude || !longitude) {
    console.warn("La ubicación no está disponible.");
    return;
  }

  // Actualizamos el mapa con las coordenadas de ubicación
  weatherMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.05
  },${latitude - 0.05},${longitude + 0.05},${
    latitude + 0.05
  }&layer=mapnik&marker=${latitude},${longitude}`;

  // Usamos la API de Nominatim para obtener más detalles sobre la ubicación
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      // Extraemos la provincia de los datos de respuesta
      const province = data.address.province;
      if (province) {
        const provinceCode = provinceCodes[province]; // Obtenemos el código de provincia
        if (provinceCode) {
          selectedProvinceCode = provinceCode; // Asignamos el código de provincia
          localStorage.setItem("selectedProvinceCode", selectedProvinceCode);

          // Actualizamos los elementos de selección de provincia
          selectHeaderProvince.value = selectedProvinceCode;
          selectSectionProvince.value = selectedProvinceCode;

          // Llamamos a la función para obtener el municipio
          await getMunicipalityByLocation();

          // Actualizamos los elementos de selección de municipio
          selectHeaderMunicipality.value = selectedMunicipalityCode;
          selectSectionMunicipality.value = selectedMunicipalityCode;

          // Mostramos las filas de clima
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
    // En caso de error al obtener los datos, mostramos un mensaje
    console.error("Error al obtener la provincia:", error);
  }
}

// Función para obtener el municipio más cercano a la ubicación
async function getMunicipalityByLocation() {
  try {
    const municipalities = await getMunicipalities(); // Obtenemos la lista de municipios
    if (!municipalities) return;

    // Recuperamos la ubicación desde localStorage
    const locationLat = parseFloat(localStorage.getItem("latitude"));
    const locationLon = parseFloat(localStorage.getItem("longitude"));

    let distances = []; // Lista para almacenar las distancias de los municipios

    municipalities.forEach((municipio) => {
      const municipioLat = parseFloat(municipio.LATITUD_ETRS89_REGCAN95);
      const municipioLon = parseFloat(municipio.LONGITUD_ETRS89_REGCAN95);

      // Calculamos la distancia entre el municipio y la ubicación actual
      const distance = haversine(
        municipioLat,
        municipioLon,
        locationLat,
        locationLon
      );

      distances.push({
        distance: distance, // Distancia calculada
        municipalityCode: municipio.CODIGOINE.slice(0, 5) // Código de municipio
      });
    });

    // Encontramos el municipio más cercano
    const closest = distances.reduce((min, curr) =>
      curr.distance < min.distance ? curr : min, { distance: Infinity });

    selectedMunicipalityCode = closest.municipalityCode; // Asignamos el código del municipio más cercano
    localStorage.setItem("selectedMunicipalityCode", selectedMunicipalityCode);

    // Actualizamos los elementos de selección del municipio
    selectHeaderMunicipality.value = selectedMunicipalityCode;
    selectSectionMunicipality.value = selectedMunicipalityCode;
  } catch (error) {
    console.error("Error al obtener municipios cercanos:", error);
  }
}

// Función para convertir grados a radianes
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Función para calcular la distancia entre dos puntos geográficos utilizando la fórmula de Haversine
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Devuelve la distancia en kilómetros
}

// Función para obtener la hora local
function getLocalHour() {
  const date = new Date();
  const hour = date.getHours();

  // Si la hora es entre las 20:00 y las 7:00, la consideramos como "noche"
  if (hour >= 20 || hour < 7) {
    localHour = "night";
  }
}

// Función para formatear la fecha en formato corto
function formatDate(fecha) {
  const date = new Date(fecha);
  const options = { weekday: "short", day: "numeric", month: "long" };
  return date.toLocaleDateString("es-ES", options); // Devolvemos la fecha en formato local
}

// Llamadas iniciales para obtener datos y configurar el sistema
getProvinces(); // Obtenemos las provincias
getLocalHour(); // Establecemos la hora local
toggleWeatherRows(); // Mostramos las filas de clima si es necesario
getLocation(); // Obtenemos la ubicación actual
