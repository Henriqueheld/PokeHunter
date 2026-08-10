import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";

export default function CameraButton() {
    return (
        <Link href="/camera" asChild> 
            <TouchableOpacity style={styles.button}>
                <FontAwesome name="camera" size={24} color="#fff"  />
            </TouchableOpacity>
        </Link>
    )
}

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        right: 22,
        bottom: 22,
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 99,
        backgroundColor: "red",
        elevation: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 7,
    }
});