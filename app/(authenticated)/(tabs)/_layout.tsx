import { Tabs } from "@/components/Tabs";
import { ImageSourcePropType, Platform } from "react-native";
import Icon from "@react-native-vector-icons/ionicons";
// import { name as ionicIconsName } from "@react-native-vector-icons/ionicons" // TODO figure out how to get ionicicons IconUri parameters for generalIconsParams
import { Colors } from "@/constants/Colors";
// SFSymbol likely not needed directly
// import { SFSymbol } from "expo-symbols";
import { AppleIcon } from "react-native-bottom-tabs";
import { generalIconParams, iosIconParams } from "@/shared/types/icons";

const platform = Platform.OS;
const iconSize: number = 30;
// Removed unused color constants
// const iconActiveColor: string = Colors.primary;
// const iconInactiveColor: string = Colors.dark;


/**
 * Gets the appropriate icon configuration based on the platform and focus state.
 * For iOS, returns the specified active/inactive AppleIcon (SF Symbol).
 * For other platforms (e.g., Android), returns an object with the base icon URI.
 * Assumes the Tabs component will handle tinting for Android icons based on focus state.
 *
 * @param platform - The current platform ('ios', 'android', etc.).
 * @param isFocused - Whether the tab is currently focused (used only for iOS).
 * @param iosIconParams - Configuration for iOS icons (SF Symbols).
 * @param generalIconParams - Configuration for general icons (Android URI).
 * @returns The icon configuration (AppleIcon for iOS, ImageSourcePropType for others).
 */
const getIcon = (
  platform: string,
  isFocused: boolean,
  iosIconParams: iosIconParams,
  generalIconParams: generalIconParams, // Updated type
): ImageSourcePropType | AppleIcon => {
  if (platform === "ios") {
    return isFocused
      ? iosIconParams.activeAppleIcon
      : iosIconParams.inactiveAppleIcon;
  }

  // For Android/other platforms, return the single base icon URI object
  // The Tabs component is expected to apply tabBarActive/InactiveTintColor
  // Add simple check for uri existence
  return { uri: generalIconParams.iconUri || "" };
};

// --- Define Icon Params ---

// Calendar
const calendarGeneralIconParams: generalIconParams = {
  size: iconSize,
  // Use the outline/base version. Provide size/color needed by sync call, but color won't be used by Tabs.
  iconUri: Icon.getImageSourceSync("calendar-outline", iconSize)?.uri,
};

const calendarIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "calendar.circle.fill" },
  inactiveAppleIcon: { sfSymbol: "calendar.circle" },
};

// Upcoming
const upcomingGeneralIconParams: generalIconParams = {
  size: iconSize,
  iconUri: Icon.getImageSourceSync("calendar-number-outline", iconSize)?.uri,
};

const upcomingIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "calendar.circle.fill" },
  inactiveAppleIcon: { sfSymbol: "calendar.circle" },
};

// Search
const searchGeneralIconParams: generalIconParams = {
  size: iconSize,
  iconUri: Icon.getImageSourceSync("search", iconSize)?.uri,
};

const searchIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "text.magnifyingglass" }, // More specific search icon
  inactiveAppleIcon: { sfSymbol: "magnifyingglass" },
};

// Browse
const browseGeneralIconParams: generalIconParams = {
  size: iconSize,
  iconUri: Icon.getImageSourceSync("browsers-outline", iconSize)?.uri,
};
const browseIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "doc.text.image.fill" },
  inactiveAppleIcon: { sfSymbol: "doc.text.image" },
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

const browseIcon = getIcon(
  platform,
  true,
  browseIosIconParams,
  browseGeneralIconParams,
);

const TabLayout = () => {
  return (
    <Tabs
      tabBarActiveTintColor={Colors.primary}
      tabBarInactiveTintColor={Colors.dark}
      hapticFeedbackEnabled={true}
      ignoresTopSafeArea={true}
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
          tabBarIcon: ({ focused }) => browseIcon,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
