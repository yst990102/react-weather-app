import React from "react";
import "./App.css";
import MainWeatherWindow from "./components/MainWeatherWindow";
import CityInput from "./components/CityInput";
import WeatherBox from "./components/WeatherBox";

class App extends React.Component {
  state = {
    city: undefined,

    // days contains objects with the following properties:
    // date, weather_desc, icon, temp
    days: new Array(5),
  };

  // creates the day objects and updates the state
  updateState = (data) => {
    const city = data.city.name;
    const days = [];
    const dayIndices = this.getDayIndices(data);

    for (let i = 0; i < 5; i++) {
      days.push({
        date: data.list[dayIndices[i]].dt_txt, // 预报时间
        // weather
        weather_desc: data.list[dayIndices[i]].weather[0].description, // 预报天气情况
        // icon
        icon: data.list[dayIndices[i]].weather[0].icon, // 预报的天气对应图标
        // main data
        temp: data.list[dayIndices[i]].main.temp, // 当前温度
        feels_like: data.list[dayIndices[i]].main.feels_like, // 体感温度
        temp_min: data.list[dayIndices[i]].main.temp_min, // 最低温度
        temp_max: data.list[dayIndices[i]].main.temp_max, // 最高温度
        pressure: data.list[dayIndices[i]].main.pressure, // 气压
        sea_level: data.list[dayIndices[i]].main.sea_level, // 海平面气压
        grnd_level: data.list[dayIndices[i]].main.grnd_level, // 地面气压
        humidity: data.list[dayIndices[i]].main.humidity, // 湿度
        // clouds
        clouds: data.list[dayIndices[i]].clouds.all, // 云层覆盖率
        // winds
        speed: data.list[dayIndices[i]].winds.speed, // 平均风速
        deg: data.list[dayIndices[i]].winds.deg, // 风向
        gust: data.list[dayIndices[i]].winds.gust, // 瞬时风速（最大风速）
        // visibility
        visibility: data.list[dayIndices[i]].visibility,
        // pop
        pop: data.list[dayIndices[i]].pop, // 降水概率（下雨的可能性）
        // sys.pod
        sys_pod: data.list[dayIndices[i]].sys.pod, // 昼夜状态
      });
    }

    this.setState({
      city: city,
      days: days,
    });
  };

  // tries to make an API call with the given city name and triggers state update
  makeApiCall = async (city) => {
    const api_data = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=6557810176c36fac5f0db536711a6c52`
    ).then((resp) => resp.json());

    if (api_data.cod === "200") {
      this.updateState(api_data);
      return true;
    } else {
      return false;
    }
  };

  // returns array with Indices of the next five days in the list
  // from the API data (every day at 12:00 pm)
  getDayIndices = (data) => {
    let dayIndices = [];
    dayIndices.push(0);

    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);

    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== "15"
      ) {
        index++;
      }
      dayIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    return dayIndices;
  };

  render() {
    const WeatherBoxes = () => {
      const weatherBoxes = this.state.days.slice(1).map((day) => (
        <li className="clickable">
          <WeatherBox {...day} />
        </li>
      ));

      return <ul className="weather-box-list">{weatherBoxes}</ul>;
    };

    return (
      <div className="App">
        <header className="App-header">
          <MainWeatherWindow data={this.state.days[0]} city={this.state.city}>
            <CityInput
              city={this.state.city}
              makeApiCall={this.makeApiCall.bind(this)}
            />
            <WeatherBoxes />
          </MainWeatherWindow>
        </header>
      </div>
    );
  }
}

export default App;
