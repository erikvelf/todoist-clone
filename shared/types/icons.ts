import { AppleIcon } from "react-native-bottom-tabs";

export interface iosIconParams {
  size: number;
  activeAppleIcon: AppleIcon;
  inactiveAppleIcon: AppleIcon;
}

// TODO fix types for IconUri so the names of the icons are suggested
export interface generalIconParams {
  size: number;
  activeIconUri: string;
  inactiveIconUri: string;
  activeColor: string;
  inactiveColor: string;
}
