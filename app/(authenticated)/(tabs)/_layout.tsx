import { Tabs } from "@/components/Tabs";
import { Image, ImageSourcePropType, Platform } from "react-native";
import Icon from "@react-native-vector-icons/ionicons";
// import { name as ionicIconsName } from "@react-native-vector-icons/ionicons" // TODO figure out how to get ionicicons IconUri parameters for generalIconsParams
import { Colors } from "@/constants/Colors";
import { SFSymbol } from "expo-symbols";
import { AppleIcon } from "react-native-bottom-tabs";
import { generalIconParams, iosIconParams } from "@/shared/types/icons";

// This code will be removed, I was testing if finnaly the react-native-vector-icons/ionicons library worked
const source = Icon.getImageSourceSync("home", 30, "red");
console.log(source?.uri);
//

const iconSize: number = 30;
const iconActiveColor: string = Colors.primary;
const iconInactiveColor: string = Colors.dark;

const getIcon = (
  platform: string,
  isFocused: boolean,
  iosIconParams: iosIconParams,
  generalIconParams: generalIconParams,
) => {
  if (platform === "ios") {
    return isFocused
      ? iosIconParams.activeAppleIcon
      : iosIconParams.inactiveAppleIcon;
  }

  return isFocused
    ? { uri: generalIconParams.activeIconUri }
    : { uri: generalIconParams.inactiveIconUri };
};

const calendarGeneralIconParams: generalIconParams = {
  size: iconSize,
  activeIconUri: Icon.getImageSourceSync("calendar-clear")?.uri,
  activeIconUri: Icon.getImageSourceSync("calendar-outline")?.uri,
  activeColor: Colors.primary,
  inactiveColor: Colors.dark,
};

const calendarIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: "calendar.circle.fill",
  inactiveAppleIcon: "calendar.circle",
};

const TabLayout = () => {
  return (
    <Tabs
      tabBarActiveTintColor={Colors.primary}
      tabBarInactiveTintColor={Colors.dark}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? "calendar.circle.fill" : "calendar.circle.fill",
          }),
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: () => ({
            sfSymbol: "calendar",
          }),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? "text.magnifyingglass" : "magnifyingglass",
          }),
        }}
      />

      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? "doc.text.image.fill" : "doc.text.image",
          }),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
