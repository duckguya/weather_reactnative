import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
} from "react-native";

export default function DetailScreen({ navigation, route }) {
  let language = route.params.language;
  let greeting = language === "french" ? "Bonjour" : "hello";

  return (
    <View>
      <Text>{greeting}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
