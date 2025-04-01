import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { Button } from "react-native";

const Layout = () => {
  return (
    // Stack makes a chain of screens like screen 1 > 2 > 3 and so on with functionallity to come back to the previous screens (LIFO stack)
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background }, // sets the background color of the page
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Today",
          headerLargeTitle: true,
          headerRight: () => <Button title="headerButton" />,
        }}
      />
    </Stack>
  );
};

export default Layout;
