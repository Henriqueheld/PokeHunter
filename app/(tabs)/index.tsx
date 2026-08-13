import { CapturedPokemon, getCapturedPokemon } from "@/services/storage";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedPokemon, setCapturedPokemon] = useState<CapturedPokemon[]>([]);

  async function getLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      setError("Permissão de localização negada.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  }

  useEffect(() => {
    getLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCapturedPokemon().then((response) => setCapturedPokemon(response));
    }, []),
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loadingText}>Buscando sua localização...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      showsUserLocation
      showsMyLocationButton
    >
      {capturedPokemon.map((pokemon) => (
        <Marker
          key={pokemon.id}
          coordinate={{
            latitude: pokemon.latitude,
            longitude: pokemon.longitude,
          }}
          title={`Pokémon #${String(pokemon.id).padStart(4, "0")}`}
          description="Toque para visualizar"
          pinColor="red"
          onPress={() => router.push(`/pokemon/${pokemon.id}`)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  error: {
    fontSize: 16,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  map: {
    height: "100%",
  },
});