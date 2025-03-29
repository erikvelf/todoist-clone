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

const platform = Platform.OS;
const iconSize: number = 30;
const iconActiveColor: string = Colors.primary;
const iconInactiveColor: string = Colors.dark;

const getIcon = (
  platform: string,
  isFocused: boolean,
  iosIconParams: iosIconParams,
  generalIconParams: generalIconParams,
): ImageSourcePropType | AppleIcon => {
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

const upcomingGeneralIconParams: generalIconParams = {
  size: iconSize,
  activeIconUri: Icon.getImageSourceSync("calendar-number")?.uri,
  activeIconUri: Icon.getImageSourceSync("calendar-number-outline")?.uri,
  activeColor: Colors.primary,
  inactiveColor: Colors.dark,
};

const upcomingIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: "calendar.circle.fill",
  inactiveAppleIcon: "calendar.circle",
};

const searchGeneralIconParams: generalIconParams = {
  size: iconSize,
  activeIconUri: Icon.getImageSourceSync("search-outline")?.uri,
  activeIconUri: Icon.getImageSourceSync("search")?.uri,
  activeColor: Colors.primary,
  inactiveColor: Colors.dark,
};

const searchIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: "text.magnifyingglass",
  inactiveAppleIcon: "magnifyingglass",
};

// ICONS ---------------------------
const calendarIcon = getIcon(
  platform,
  true,
  calendarIosIconParams,
  calendarGeneralIconParams,
);

const upcomingIcon = getIcon(
  platform,
  true,
  upcomingIosIconParams,
  upcomingGeneralIconParams,
);

const searchIcon = getIcon(
  platform,
  true,
  searchIosIconParams,
  searchGeneralIconParams,
);

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
          tabBarIcon: ({ focused }) => calendarIcon,
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: () => upcomingIcon,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => searchIcon,
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
