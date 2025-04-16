import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";

const TaskScreen = () => {
const { id } = useLocalSearchParams();
  return <View style={styles.container}>
    <Text>TaskScreen: {id}</Text>
  </View>
}   

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
