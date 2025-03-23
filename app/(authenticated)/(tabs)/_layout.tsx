import { Tabs } from "@/components/Tabs";
import { Image, ImageSourcePropType, Platform } from "react-native";
import Icon from "@react-native-vector-icons/ionicons";
// import { name as ionicIconsName } from "@react-native-vector-icons/ionicons" // TODO figure out how to get ionicicons IconUri parameters for generalIconsParams
import { Colors } from "@/constants/Colors";
import { SFSymbol } from "expo-symbols";
import { AppleIcon } from "react-native-bottom-tabs";

// This code will be removed, I was testing if finnaly the react-native-vector-icons/ionicons library worked
const source = Icon.getImageSourceSync("home", 30, "red");
console.log(source?.uri);
//

const iconSize: number = 30;
const iconActiveColor: string = Colors.primary;
const iconInactiveColor: string = Colors.dark;

interface iosIconParams {
  size: number;
  activeAppleIcon: AppleIcon;
  inactiveAppleIcon: AppleIcon;
}

// TODO fix types for IconUri so the names of the icons are suggested
interface generalIconParams {
  size: number;
  activeIconUri: string;
  inactiveIconUri: string;
  activeColor: string;
  inactiveColor: string;
}

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => ({ uri: source?.uri }),
        }}
      />
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
