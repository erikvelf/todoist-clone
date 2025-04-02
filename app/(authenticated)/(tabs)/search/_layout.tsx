import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

const Layout = () => {
  return (
    // Stack makes a chain of screens like screen 1 > 2 > 3 and so on with functionallity to come back to the previous screens (LIFO stack)
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.backgroundAlt },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitle: true,
          title: "Search",
          headerSearchBarOptions: {
            placeholder: "Tasks, Projects and More",
            tintColor: Colors.primary,
            textColor: Colors.primary,
            headerIconColor: Colors.primary,
            barTintColor: Colors.backgroundAlt,
          },
        }}
      />
    </Stack>
  );
};

export default Layout;
