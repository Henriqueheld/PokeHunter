import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { BarcodeScanningResult, CameraType, CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [takingPicture, setTakingPicture] = useState(false);
  const [scaneed, setScaneed] = useState(false);

  function toggleCameraFacing() {
    setFacing((oldState) => oldState === "back" ? "front" : "back");
  }

  function toggleFlash() {
    setFlash((oldState) => oldState === "off" ? "on" : "off");
  }

  async function takePicture() {
    if (!cameraRef.current || takingPicture) return;

    setTakingPicture(true);
    const mediaLibrary = await MediaLibrary.requestPermissionsAsync();

    if (mediaLibrary.status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso ao armazenamento para salvar na galeria.",
      );
      return;
    }

    cameraRef.current
    .takePictureAsync()
    .then((photo) => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        Alert.alert("Foto salva com sucesso!");
      })
    })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Não foi possível capturar a foto.");
      })
      .finally(() => setTakingPicture(false));
  }

  async function handleBarcodeScanned(result: BarcodeScanningResult) {
    if(scaneed) return;
    setScaneed(true);
    Alert.alert("QR code", result.data)
  }

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#ee0a0a" />
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <FontAwesome name="camera" size={54} color="#ffffff" />

        <Text style={styles.permissionTitle}>Acesso à câmera</Text>
        <Text style={styles.permissionText}>
          O Pokéhunter precisa de acesso à câmera para capturar Pokémon.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir acesso</Text>
        </TouchableOpacity>

        <Pressable style={styles.cancelButton} onPress={router.back}>
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={facing}
        flash={flash}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"]
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <SafeAreaView style={styles.overlay} edges={["top"]}>
        <View style={styles.topControls}>
          <Pressable style={styles.controlButton} onPress={router.back}>
            <FontAwesome name="close" size={24} color="#ffffff" />
          </Pressable>

          <Pressable style={[
            styles.controlButton,
            flash === "on" && styles.activeControlButton,
          ]}
            onPress={toggleFlash}
          >

            <FontAwesome
              name="bolt"
              size={24}
              color={flash === "on" ? "#ffd60a" : "#ffffff"}
            />

          </Pressable>
        </View>

        <View style={styles.bottomArea}>
          <View style={styles.modeContainer}>
            <Text style={styles.activeMode}>FOTO</Text>
          </View>

          <View style={styles.cameraControls}>
            <View style={styles.sideButton} />

            <Pressable style={styles.captureButtonOuter} onPress={takePicture} disabled={takingPicture}>
              <View style={[
                styles.captureButtonInner,
                takingPicture && styles.captureButtonPressed,
                ]}
                >
                <MaterialIcons 
                name="catching-pokemon" 
                size={takingPicture ? 56 : 64}
                 color="#000000" 
                 />
              </View>
            </Pressable>

            <Pressable style={styles.sideButton} onPress={toggleCameraFacing}>
              <View style={styles.flipButton}>
                <FontAwesome name="refresh" size={24} color="#ffffff" />
              </View>
            </Pressable>
          </View>
          <SafeAreaView edges={["bottom"]} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#1e1e1e",
  },
  camera: {
    height: "100%",
  },
  permissionContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#121212",
  },
  permissionTitle: {
    marginTop: 16,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  permissionText: {
    marginTop: 8,
    color: "#a3a3a3",
    fontSize: 16,
    textAlign: "center",
  },
  permissionButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#ee0a0a",
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 16,
    padding: 10,
  },
  cancelButtonText: {
    color: "#ee0a0a",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  activeControlButton: {
    backgroundColor: "#rgba(255, 255, 255, 0.2)",
  },
  bottomArea: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    gap: 28,
  },
  activeMode: {
    color: "#e9e8e5",
    fontSize: 13,
    fontWeight: "semibold",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  captureButtonOuter: {

  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fcfcfc",
  },

  captureButtonPressed: {
    width: 56,
    height: 56,
    borderRadius: 28,
    opacity: 0.8,
  },
  sideButton: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
});