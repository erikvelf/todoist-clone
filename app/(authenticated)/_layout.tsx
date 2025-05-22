import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, useWindowDimensions, Text, StyleSheet, Platform, Button } from "react-native";

const Layout = () => {
  const router = useRouter();
  const screenHeight = useWindowDimensions().height;

  return (
    <Stack screenOptions={{
      contentStyle: { backgroundColor: "fff" },
      headerTintColor: Colors.primary,
      headerTitleStyle: { color: "#000" },
      // headerTitleAlign: "center",
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="task/new" options={{
        presentation: "formSheet",
        title: "",
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
        sheetAllowedDetents: screenHeight > 700 ? [0.22] : "fitToContents",
        sheetGrabberVisible: false,
        sheetExpandsWhenScrolledToEdge: false,
        sheetCornerRadius: 10,
      }} />
      <Stack.Screen name="task/[id]" options={{
        presentation: "formSheet",
        title: "",
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
        sheetAllowedDetents: screenHeight > 700 ? [0.22] : "fitToContents",
        sheetGrabberVisible: false,
        sheetExpandsWhenScrolledToEdge: false,
        sheetCornerRadius: 10,
      }} />
      <Stack.Screen name="task/date-select" options={{
        presentation: "modal",
        title: "Schedule",
        headerLeft: () => Platform.OS === "ios" ? <Button title="Cancel" color={Colors.primary} onPress={() => router.dismiss()} /> : null,
        headerTitleAlign: "center",
        headerRight: () => (
          <Pressable onPress={() => router.back()}>
            <Text style={styles.doneButton}>Done</Text>
          </Pressable>
        ),
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }} />
      <Stack.Screen name="task/project-select" options={{
        presentation: "modal",
        title: "Select Project",
        headerTitleAlign: "center",
        headerLeft: () => Platform.OS === "ios" ? <Button title="Cancel" color={Colors.primary} onPress={() => router.dismiss()} /> : null,
        headerRight: () => (
          <Pressable onPress={() => router.push("/browse/new-project")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="add" size={24} color={Colors.primary} />
            {/* <Text style={styles.doneButton}>Add</Text> */}
          </Pressable>
        ),
      }} />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({
  doneButton: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
