import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function getLocation() {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setError("Permisão de localização negada");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (updatedLocation) => {
          setLocation({
            latitude: updatedLocation.coords.latitude,
            longitude: updatedLocation.coords.longitude,
          });
        },
      );
    }

    getLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <View>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#red" />
        <Text style={styles.loadingText}>Buscando localização...</Text>
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
      showsMyLocationButton
      showsCompass
      showsUserLocation={false}
    >
      <Marker
        coordinate={location}
        anchor={{ x: 0.5, y: 1 }}
        image={require("../../assets/images/icons8-pokemon-pointer-100.png")}
      />
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },

  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "red",
  },

  map: {
    height: "100%",
  },
});
