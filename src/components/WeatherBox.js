import React from "react";
import "./WeatherBox.css";

export default class WeatherBox extends React.Component {
  // returns weekday to a given Date value
  getDay = (date) => {
    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[new Date(date).getDay()];
  };

  render(props) {
    return (
      <div className="weather-box" onClick={() => console.log(this.props)}>
        <h1>{this.props.date ? this.getDay(this.props.date) : ""}</h1>
        <img
          src={
            this.props.icon
              ? require(`../images/${this.props.icon}.svg`)
              : require("../images/01d.svg")
          }
          alt="sun"
        />
        <h2>{this.props.weather_desc ? this.props.weather_desc : ""}</h2>
        <span className="temp">{Math.round(this.props.temp - 273.15)}°C</span>
      </div>
    );
  }
}
