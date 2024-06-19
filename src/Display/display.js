import React, { useState, useEffect } from "react";
import LocationInput from "../Location/getLocation.js";
import classNames from "classnames";
import styles from "./display.module.css";
import { FaTint, FaWind, FaCompass } from "react-icons/fa";

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("Berlin");
  const [date, setDate] = useState("");
  const [windSpeed, setWindSpeed] = useState(null);
  const [windDirection, setWindDirection] = useState(null);

  const getCardinalDirection = (angle) => {
    const directions = [
      "North",
      "North-East",
      "East",
      "South-East",
      "South",
      "South-West",
      "West",
      "North-West",
    ];
    const index = Math.round((angle % 360) / 45);
    return directions[index % 8];
  };

  useEffect(() => {
    if (location === "") {
      return;
    }

    setLoading(true);
    setError(null);

    const getDate = () => {
      const today = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = today.toLocaleDateString("en-US", options);
      setDate(formattedDate);
    };

    getDate();
    const apiKey = "Your API Key";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    console.log(apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setWeather(data);

        if (data.wind) {
          const speedInKmh = data.wind.speed * 3.6;
          const direction = getCardinalDirection(data.wind.deg);

          setWindSpeed(speedInKmh.toFixed(2));
          setWindDirection(direction);
        }

        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [location]);

  const handleLocationSubmit = (newLocation) => {
    setLocation(newLocation);
  };

  const getWeatherClass = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) {
      return styles.thunderstorm;
    } else if (weatherId >= 300 && weatherId < 600) {
      return styles.rain;
    } else if (weatherId >= 600 && weatherId < 700) {
      return styles.snow;
    } else if (weatherId >= 700 && weatherId < 800) {
      return styles.wind;
    } else if (weatherId === 800) {
      return styles.clearSky;
    } else if (weatherId > 800) {
      return styles.cloudy;
    }
    return "";
  };

  return (
    <main className={classNames(styles.main)}>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {weather && !loading && !error && (
        <section
          className={classNames(
            styles.display,
            getWeatherClass(weather.weather[0].id)
          )}
        >
         <div className={classNames(styles.section_div)}>
         <h1 className="styles.h1">{weather.name}</h1>
            <h2 className="styles.h2">
              {Math.round(weather.main.temp - 273.15)}{" "}
              <span className="styles.span">° C</span>
            </h2>
            <div className={classNames(styles.min_max)}>
              <h3 className="styles.h3">
                Min: {Math.round(weather.main.temp_min - 273.15)} ° C
              </h3>
              <h3 className="styles.h3">
                Max: {Math.round(weather.main.temp_max - 273.15)} ° C
              </h3>
            </div>
            <table className="styles.table">
              <tbody>
                <tr className="styles.tr">
                  <th className="styles.th">
                    <FaTint size={50} color="gray" />
                  </th>
                  <th className="styles.th">
                    <FaWind size={50} color="gray" />
                  </th>
                  <th className="styles.th">
                    <FaCompass size={50} color="gray" />
                  </th>
                </tr>
                <tr>
                  <td>{Math.round(weather.main.humidity)} %</td>
                  <td>{Math.round(windSpeed)}</td>
                  <td>{windDirection}</td>
                </tr>
              </tbody>

            </table>
            <h4>{date}</h4>
          </div>
          
        </section>
      )}
      <aside className={classNames(styles.box)}>
        <LocationInput onLocationSubmit={handleLocationSubmit} />
      </aside>
    </main>
  );
}

export default WeatherApp;
