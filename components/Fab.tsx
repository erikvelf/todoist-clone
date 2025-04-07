import { Colors } from "@/constants/Colors";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
// import { toast } from "sonner-native/lib/typescript/commonjs/src/types";
import { toast } from "sonner-native";

import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

console.log(Math.trunc(windowHeight), "window height");

const Fab = () => {
  const handlePress = () => {
    toast.success("Fab pressed");
    console.log("Fab pressed");
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Ionicons name="add" size={24} color="white" />
      {/* <Text>+</Text> */}
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
