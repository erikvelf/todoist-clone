import { Colors } from "@/constants/Colors";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
// import { toast } from "sonner-native/lib/typescript/commonjs/src/types";
import { toast } from "sonner-native";

import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

console.log(Math.trunc(windowHeight), "window height");

const Fab = () => {
  const handlePress = () => {
    toast.success("Fab pressed");
    console.log("Fab pressed");
  };

  return (
    <TouchableOpacity>
      <Text style={styles.fab} onPress={() => handlePress()}>
        Fab
      </Text>
    </TouchableOpacity>
  );
};

export default Fab;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    top: (Math.trunc(windowHeight) * 2) / 3,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 50,
  },
});
