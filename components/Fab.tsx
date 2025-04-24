import { Colors } from "@/constants/Colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useBottomSheet } from "@/context/BottomSheetContext";

const Fab = () => {
  // const router = useRouter(); // Remove or comment out if navigation is no longer needed here
  const { bottomSheetRef } = useBottomSheet(); // Get ref from context

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // router.push("/task/new"); // Replace navigation with bottom sheet expansion
    bottomSheetRef.current?.expand(); // Expand the bottom sheet to the first snap point
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default Fab;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 15,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.2)",
  },
});
