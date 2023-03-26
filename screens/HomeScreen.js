// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createNativeStackNavigator();

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

export default function HomeScreen({ navigation }) {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const [today, setToday] = useState("");
  const [datas, setDatas] = useState({});

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
    setDatas(json);
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

  // const mphToMetersPerSecond = async () => {
  //   if (datas) {
  //     const kmPerHour = datas.current.wind_speed * 1.60934;
  //     const metersPerSecond = kmPerHour / 3.6;

  //     let newDatas = { ...datas };
  //     newDatas.current.wind_speed = Number(metersPerSecond.toFixed(2));
  //     setDatas({ ...datas, newDatas });
  //   }
  // };

  useEffect(() => {
    getWeather();
    formatDate();
    // mphToMetersPerSecond();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[styles.fs30, styles.fw600]}>{city}</Text>
          <Button
            color="#ff7675"
            title=">>"
            onPress={() => navigation.navigate("Detail", { laguage: "french" })}
          />
        </View>
        <Text style={styles.fs15}>{today}</Text>
      </View>
      <View style={styles.hrline} />

      <ScrollView
        pagingEnabled
        contentContainerStyle={styles.fs30}
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
                <View style={styles.tempWrapper}>
                  <Fontisto
                    name={icons[day.weather[0].main][0]}
                    size={25}
                    color="black"
                    paddingRight="5%"
                  />
                  <Text style={styles.fs20}>
                    {icons[day.weather[0].main][1]}
                  </Text>
                </View>
                <Text style={styles.fs100}>
                  {parseFloat(datas?.current?.temp).toFixed(1)}°
                </Text>
              </View>
              <View style={styles.hrline} />

              <View>
                {!datas ? (
                  <View style={{ ...styles.middle, alignItems: "center" }}>
                    <ActivityIndicator color={"black"} size="large" />
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text style={[styles.fs15, styles.fw600]}>
                          습도 {datas?.current?.humidity}%
                        </Text>
                        <Text style={styles.fs15}>
                          체감온도{" "}
                          {parseFloat(datas?.current?.feels_like).toFixed(1)}°
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.fs15, styles.fw600]}>
                          바람 {datas?.current?.wind_speed}m/s
                        </Text>
                        <Text style={styles.fs15}>
                          {day.weather[0].description}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
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
  },
  topWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "left",
  },
  // cityName: {
  //   fontSize: 30,
  //   fontWeight: "500",
  // },
  weather: {},
  middle: {
    width: SCREEN_WIDTH - 60,
    paddingVertical: 80,
  },
  tempWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  fs100: {
    fontWeight: "600",
    fontSize: 120,
    marginTop: -15,
  },
  fs30: {
    fontSize: 30,
  },
  fs20: {
    fontSize: 20,
  },
  fs15: {
    fontSize: 15,
  },
  fw600: {
    fontWeight: 600,
  },
  hrline: {
    borderWidth: 0.8,
    backgroundColor: "black",
    marginVertical: 30,
  },
});
