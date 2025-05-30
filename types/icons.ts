import { AppleIcon } from "react-native-bottom-tabs";

export interface iosIconParams {
  size: number;
  activeAppleIcon: AppleIcon;
  inactiveAppleIcon: AppleIcon;
}

/**
 * Parameters for generating general platform icons, typically used for Android.
 * Assumes the tab bar component will handle tinting based on focus state.
 */
export interface generalIconParams {
  /** The size of the icon. */
  size: number;
  /** The URI for the base (usually inactive/outline) icon. Must be generated using Icon.getImageSourceSync. */
  iconUri: string | undefined;
  /** The URI for the inactive icon. Must be generated using Icon.getImageSourceSync. */
  inactiveIconUri: string | undefined;
}
