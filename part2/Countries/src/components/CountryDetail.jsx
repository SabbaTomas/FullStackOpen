import React, { useEffect, useState } from "react";
import wheater from "../services/wheater"


const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)

    useEffect(() => {
    if (country.capital && country.capital.length > 0) {
      wheater.getWeather(country.capital[0])
        .then(data => {
          setWeather(data)
        })
        .catch(error => {
          console.error("Error fetching weather data:", error)
        })
    }
  }, [country])

   return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital ? country.capital.join(', ') : 'N/A'}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {country.languages &&
          Object.values(country.languages).map(lang => (
            <li key={lang}>{lang}</li>
          ))
        }
      </ul>
      {country.flags && (
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      )}
      <h3>Weather in {country.capital}</h3>
      {weather ? (
        <div>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>)}    

    export default CountryDetail