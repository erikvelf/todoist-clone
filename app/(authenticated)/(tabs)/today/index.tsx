import { View, Text, StyleSheet } from "react-native";
import Fab from "@/components/Fab";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Page = () => {
  return (
    <View style={styles.container}>
      <Text>Today</Text>
      <Fab />
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
