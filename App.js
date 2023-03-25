// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
console.log(SCREEN_WIDTH);
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: ["cloudy", "흐림"],
  Clear: ["day-sunny", "맑음"],
  Rain: ["rains", "비"],
  Drizzle: ["rain", "이슬비"],
  Atmosphere: ["cloudy-gusts", "안개/먼지"],
  Snow: ["snow", "눈"],
  Thunderstorm: ["lightning", "천둥번개"],
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const [today, setToday] = useState("");

  const getWeather = async () => {
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
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );

    const json = await response.json();
    setDays(json.daily);
  };

  const formatDate = () => {
    const date = new Date();
    const day = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
      date
    );
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      date
    );
    const dateNumber = String(date.getDate()).padStart(2, "0");
    const today = `${day}, ${dateNumber} ${month}`;
    setToday(today);
  };

  useEffect(() => {
    getWeather();
    formatDate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        <Text>{today}</Text>
      </View>
      <View style={styles.hrline} />

      <ScrollView
        pagingEnabled
        contentContainerStyle={styles.weather}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.middle, alignItems: "center" }}>
            <ActivityIndicator color={"black"} size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index}>
              <View style={styles.middle}>
                <Text style={styles.font100}>
                  {parseFloat(day.temp.day).toFixed(1)}°
                </Text>
                <View style={styles.tempWrapper}>
                  <Fontisto
                    name={icons[day.weather[0].main][0]}
                    size={30}
                    color="black"
                    paddingRight="5%"
                  />
                  <Text style={styles.font20}>
                    {icons[day.weather[0].main][1]}
                  </Text>
                </View>
              </View>
              <View style={styles.hrline} />
              <View>
                <Text style={styles.font20}>123</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dcdcdc",
    padding: 30,
    paddingTop: 80,
  },
  city: {
    flex: 0.2,
    justifyContent: "flex-end",
    alignItems: "left",
    paddingTop: 30,
  },
  cityName: {
    fontSize: 30,
    fontWeight: "500",
  },
  weather: {},
  middle: {
    width: SCREEN_WIDTH - 60,
    marginVertical: 80,
  },
  tempWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  font100: {
    fontWeight: "700",
    fontSize: 120,
  },
  font20: {
    fontSize: 18,
  },
  hrline: {
    borderWidth: 0.8,
    backgroundColor: "black",
    marginVertical: 30,
  },
});
