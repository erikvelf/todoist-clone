import { ImageSourcePropType, Platform } from "react-native";
import { AppleIcon } from "react-native-bottom-tabs";
import { generalIconParams, iosIconParams } from "@/types/icons";
import Icon from "@react-native-vector-icons/ionicons";

const platform = Platform.OS;
const iconSize: number = 30;

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
export const getIcon = (
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
  return { uri: isFocused ? generalIconParams.inactiveIconUri : generalIconParams.iconUri };
};

// --- Define Icon Params ---

// Calendar
export const calendarGeneralIconParams: generalIconParams = {
  size: iconSize,
  // Use the outline/base version. Provide size/color needed by sync call, but color won't be used by Tabs.
  iconUri: Icon.getImageSourceSync("calendar-outline", iconSize)?.uri,
  inactiveIconUri: Icon.getImageSourceSync("calendar", iconSize)?.uri,
};

export const calendarIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "calendar.circle.fill" },
  inactiveAppleIcon: { sfSymbol: "calendar.circle" },
};

// Upcoming
export const upcomingGeneralIconParams: generalIconParams = {
  size: iconSize,
  iconUri: Icon.getImageSourceSync("calendar-number-outline", iconSize)?.uri,
  inactiveIconUri: Icon.getImageSourceSync("calendar-number", iconSize)?.uri,
};

export const upcomingIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "calendar.circle.fill" },
  inactiveAppleIcon: { sfSymbol: "calendar.circle" },
};

// Search
export const searchGeneralIconParams: generalIconParams = {
  size: iconSize,
  iconUri: Icon.getImageSourceSync("search-outline", iconSize)?.uri,
  inactiveIconUri: Icon.getImageSourceSync("search", iconSize)?.uri,
};

export const searchIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "text.magnifyingglass" }, // More specific search icon
  inactiveAppleIcon: { sfSymbol: "magnifyingglass" },
};

// Browse
export const browseGeneralIconParams: generalIconParams = {
  size: iconSize,
  iconUri: Icon.getImageSourceSync("browsers-outline", iconSize)?.uri,
  inactiveIconUri: Icon.getImageSourceSync("browsers", iconSize)?.uri,
};

export const browseIosIconParams: iosIconParams = {
  size: iconSize,
  activeAppleIcon: { sfSymbol: "doc.text.image.fill" },
  inactiveAppleIcon: { sfSymbol: "doc.text.image" },
};

// ICONS ---------------------------
export const calendarIcon = getIcon(
  platform,
  true,
  calendarIosIconParams,
  calendarGeneralIconParams,
);

export const upcomingIcon = getIcon(
  platform,
  true,
  upcomingIosIconParams,
  upcomingGeneralIconParams,
);

export const searchIcon = getIcon(
  platform,
  true,
  searchIosIconParams,
  searchGeneralIconParams,
);

export const browseIcon = getIcon(
  platform,
  true,
  browseIosIconParams,
  browseGeneralIconParams,
);