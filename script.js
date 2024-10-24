"use strict";
const citiesContainer = document.querySelector(".cities");
const btn = document.querySelector(".see-more-container");
const input = document.querySelector(".city-input");
const seeMoreContainer = document.querySelector(".see-more-container");
const weatherTranslations = {
    "clear sky": "ciel dégagé",
    "few clouds": "quelques nuages",
    "scattered clouds": "nuages épars",
    "broken clouds": "nuages fragmentés",
    "overcast clouds": "ciel couvert",
    "shower rain": "averses de pluie",
    "rain": "pluie",
    "light rain": "pluie légère",
    "moderate rain": "pluie modérée",
    "thunderstorm": "orage",
    "snow": "neige",
    "mist": "brume"

};



function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}


function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

function getDayColor(day) {
    const colors = {
        'lundi': 'red',
        'mardi': 'blue',
        'mercredi': 'green',
        'jeudi': 'orange',
        'vendredi': 'purple',
        'samedi': 'brown',
        'dimanche': 'pink'
    };
    return colors[day.toLowerCase()] || 'black';
}

async function getJSON(url, errorMsg = "Something went wrong.") {
    
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(errorMsg);
        }
        const data = await res.json();
        return data;
    
        console.log(error);
        renderError(error);
    
}

function renderCity(data) {
    const days = {};

  
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) {
            days[date] = {
                entries: [],
                weather: item.weather[0].description,
                icon: item.weather[0].icon
            };
        }
        days[date].entries.push(item);
    });
    const dates = Object.keys(days);
    const firstDay = dates[0];
    const firstEntry = days[firstDay].entries[0];
    const avgTemp = kelvinToCelsius(firstEntry.main.temp);
    const avgHumidity = firstEntry.main.humidity;
    const dayName = new Date(firstEntry.dt_txt).toLocaleDateString('fr-FR', { weekday: 'long' });
    const dayColor = getDayColor(dayName);
    const weatherDescription = weatherTranslations[days[firstDay].weather] || days[firstDay].weather;



    let html = `
        <div class="weather-card first-entry">
            <h3>${data.city.name}</h3>
            <h4>${data.city.country}</h4>
            <h4 style="color: ${dayColor};">${dayName}</h4>
            <p>${formatDateTime(firstEntry.dt_txt)}</p>
            <p>🌡️ ${avgTemp} °C</p>
            <p>💧 ${avgHumidity}%</p>
            <p><span>☁️</span>Conditions : ${weatherDescription}</p>
            <img src="http://openweathermap.org/img/wn/${days[firstDay].icon}.png" alt="Weather icon">
        </div>
    `;


    citiesContainer.innerHTML = html;
    // citiesContainer.style.opacity = 1;

    // Vérifie si le bouton existe déjà
    if (!document.querySelector(".see-more-button")) {
        const seeMoreButton = document.createElement("button");
        seeMoreButton.textContent = "Voir plus";
        seeMoreButton.classList.add("see-more-button", "button-85", "neonText");
        
        seeMoreButton.addEventListener("click", () => {
            renderMoreDays(days);
            seeMoreButton.style.display = "none"; // Cache le bouton après le clic
        });

        citiesContainer.appendChild(seeMoreButton);
    // console.log(btn.textContent);

    }

    citiesContainer.style.opacity = 1;
    }

    // citiesContainer.appendChild(seeMoreContainer);




function renderMoreDays(days) {
    
    let html = '<div class="weather-row">'; 
    const dates = Object.keys(days).slice(0); 
    dates.forEach(date => {
        days[date].entries.forEach(entry => {
            const avgTemp = kelvinToCelsius(entry.main.temp);
            const avgHumidity = entry.main.humidity;
            const dayName = new Date(entry.dt_txt).toLocaleDateString('fr-FR', { weekday: 'long' });
            const dayColor = getDayColor(dayName);

            html += `
                <div class="weather-card">
                    <h4 style="color: ${dayColor};">${dayName}</h4>
                    <p>${formatDateTime(entry.dt_txt)}</p>
                    <p>🌡️ ${avgTemp} °C</p>
                    <p>💧 ${avgHumidity}%</p>
                    <p>☁️ ${weatherTranslations[days[date].weather] || days[date].weather}</p>
                    <img src="http://openweathermap.org/img/wn/${days[date].icon}.png" alt="Weather icon">
                </div>
            `;
        });
    });

    html += '</div>'; 
    citiesContainer.insertAdjacentHTML("beforeend", html);
}

function renderError(msg) {
    citiesContainer.innerHTML = `<p>${msg}</p>`;
    citiesContainer.style.opacity = 1;
}

function getCityData(city) {
    getJSON(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=9c442f9bcfae8c11436b70a6dc003a25`,
        "Enter a valid city name"
    )
    .then(data => {
        renderCity(data);
    })
    .catch(err => {
        console.error(err);
        renderError(err.message);
    })
    .finally(() => {
        console.log("Request ended");
    });
}


btn.addEventListener("click", () => {
    const city = input.value.trim();
    if (city) {
        citiesContainer.innerHTML = ''; 
        seeMoreContainer.innerHTML = 'Recherche'; 
        getCityData(city);
        input.value = ""; 
    }
});


input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        btn.click(); 
    }
});

// getCountryData("paris");
