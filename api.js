import axios from "axios";
import { API_KEY } from "@env";
import * as Location from "expo-location";

export async function FetchWeathers() {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync();
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );

    let newJson = { ...response.data };
    newJson.city = location[0].city;
    newJson.daily.map((d) => {
      const date = new Date(d.dt * 1000);
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      d.dt = timeString;
    });
    newJson.hourly.map((d) => {
      const date = new Date(d.dt * 1000);
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      d.dt = timeString;
    });

    return newJson;
  } catch (error) {
    console.log("error: ", error);
  }
}
