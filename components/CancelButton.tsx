import { Platform, Button } from "react-native";
import { Colors } from "../constants/Colors";
import { useRouter } from "expo-router";

export const CancelButton = () => {
    const router = useRouter();
    return Platform.OS === "ios" ? <Button title="Cancel" color={Colors.primary} onPress={() => router.dismiss()} /> : null;
};