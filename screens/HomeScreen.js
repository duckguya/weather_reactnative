import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Fontisto } from "@expo/vector-icons";
import { FetchWeathers } from "../api";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const [today, setToday] = useState("");
  const { data, isLoading, isError } = useQuery(["weathers"], () =>
    FetchWeathers()
  );

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
    formatDate();
  }, []);

  let state = "ok";
  if (isLoading) state = "loading";
  if (isError) state = "error";

  return (
    <View style={styles.container}>
      {state === "error" && <Text>"error!"</Text>}
      {state === "loading" && (
        <View style={styles.loading}>
          <ActivityIndicator color={"black"} size="large" />
        </View>
      )}
      {state === "ok" && data && (
        <>
          <View style={styles.topWrapper}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.fs30, styles.fw600]}>{data.city}</Text>
              <Button
                // color="#ff7675"
                title=">>"
                onPress={() =>
                  navigation.navigate("Detail", { laguage: "french" })
                }
              />
            </View>
            <Text style={styles.fs15}>{today}</Text>
          </View>
          <View style={styles.hrline} />

          <View>
            <View style={styles.middle}>
              <View style={styles.tempWrapper}>
                <Fontisto
                  name={icons[data.current.weather[0].main][0]}
                  size={25}
                  color="black"
                  paddingRight="5%"
                />
                <Text style={styles.fs20}>
                  {icons[data.current.weather[0].main][1]}
                </Text>
              </View>
              <Text style={styles.fs100}>
                {parseFloat(data?.current?.temp).toFixed(1)}°
              </Text>
            </View>
            <View style={styles.hrline} />

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={[styles.fs15, styles.fw600]}>
                    습도 {data?.current?.humidity}%
                  </Text>
                  <Text style={styles.fs15}>
                    체감온도 {parseFloat(data?.current?.feels_like).toFixed(1)}°
                  </Text>
                </View>
                <View>
                  <Text style={[styles.fs15, styles.fw600]}>
                    바람 {data?.current?.wind_speed}m/s
                  </Text>
                  <Text style={styles.fs15}>
                    {data.current.weather[0].description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 30,
  },
  loading: {
    width: SCREEN_WIDTH - 60,
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  topWrapper: {
    flex: 0.5,
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
