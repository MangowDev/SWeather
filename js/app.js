const homeMunicipality = document.querySelector("#homeMunicipality");
const homeTemperature = document.querySelector("#homeTemperature");
const homeMinTemperature = document.querySelector("#homeMinTemperature");
const homeMaxTemperature = document.querySelector("#homeMaxTemperature");
const homeState = document.querySelector("#homeState");
const homeRainChance = document.querySelector("#homeRainChance");
const homeHumidity = document.querySelector("#homeHumidity");
const homeSunrise = document.querySelector("#homeSunrise");
const homeSunset = document.querySelector("#homeSunset");

async function getHomeTime() {
  try {
    const response = await fetch(
      "https://www.el-tiempo.net/api/json/v2/provincias/18/municipios/18143"
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
    if (data.lluvia === "") {
      homeRainChance.textContent = `0%`;
    } else {
      homeRainChance.textContent = `${data.lluvia}%`;
    }
    homeHumidity.textContent = `${data.humedad}%`;
    homeSunrise.textContent = data.pronostico.hoy["@attributes"].orto;
    homeSunset.textContent = data.pronostico.hoy["@attributes"].ocaso;
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

getHomeTime();
