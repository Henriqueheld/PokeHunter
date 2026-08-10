import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function PokedexTabIcon({ color }: { color: string }) {
  return (
    <Image
      source={require("../../assets/images/icons8-pokedex-96.png")}
      style={{ width: 28, height: 28, tintColor: color, marginBottom: -3 }}
      resizeMode="contain"
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "red",
        tabBarStyle: {
          backgroundColor: "#1E1E1E",
          borderTopColor: "#941313",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mapa",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pokedex"
        options={{
          title: "Pokédex",
          headerShown: false,
          tabBarIcon: ({ color }) => <PokedexTabIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
