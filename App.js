// import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DetailScreen from "./screens/DetailScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      {/* //네비게이션의 트리를 관리해주는 컴포넌트 */}
      <NavigationContainer>
        {/* 네비게이션 기본틀의 스택을 생성 */}
        <Stack.Navigator>
          {/* 해당스택에 들어갈 화면 요소를 넣어준다. */}
          <Stack.Screen name="Today" component={HomeScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
