import { useUser } from "@clerk/clerk-expo";
import { StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const Layout = () => {
  return (
    // Stack makes a chain of screens like screen 1 > 2 > 3 and so on with functionallity to come back to the previous screens (LIFO stack)
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Browse",
          headerTitleAlign: "center",
          // headerLargeTitle: true,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="new-project"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

const HeaderLeft = () => {
  const { user } = useUser();
  return <Image src={user?.imageUrl} style={styles.image} />;
};

const HeaderRight = () => {
  return (
    <Link href="/browse/settings">
      <Ionicons name="settings-outline" size={24} color={Colors.primary} />
    </Link>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default Layout;
