import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useWindowDimensions } from "react-native";

const Layout = () => {
  const screenHeight = useWindowDimensions().height;

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "fff" } }}>
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
    </Stack>
  );
};

export default Layout;
