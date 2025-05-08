import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Button, Platform } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack screenOptions={{
      headerShadowVisible: false,
      headerTintColor: Colors.primary,
      headerTitleStyle: { color: "#000" },
      contentStyle: { backgroundColor: Colors.backgroundAlt },
      headerTitleAlign: "center",
    }}>
      <Stack.Screen name="index" options={{
        headerTransparent: true,
        title: "New Project",
        headerLeft: () => Platform.OS === "ios" ? <Button title="Cancel" color={Colors.primary} onPress={() => router.dismiss()} /> : null,
      }}/>
      <Stack.Screen name="color-select" options={{
        headerTitle: "Color",
      }}/>
    </Stack>
  )
}   

export default Layout;