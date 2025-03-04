import * as WebBrowser from "expo-web-browser";
import { StyleSheet, Image } from "react-native";
import {
  UseOAuthFlowParams,
  useSSO,
  StartSSOFlowParams,
  useOAuth,
} from "@clerk/clerk-expo";
import { useCallback } from "react";
import { Button, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { top } = useSafeAreaInsets();
  // const { startSSOFlow } = useSSO();

  const handleAppleOAuth = async () => {
    try {
      // Important for updating our current session
      const { createdSessionId, setActive } = await startOAuthFlow();
      console.log("handleAppleOAuth ~ createSessionId", createdSessionId);

      // locally set the user as active using the current sessionId
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      // otherwise catch error
      console.log(error);
    }
  };

  const handleGoogleOAuth = async () => {
    try {
      // Important for updating our current session
      const { createdSessionId, setActive } = await googleAuth();
      console.log("handleAppleOAuth ~ createSessionId", createdSessionId);

      // locally set the user as active using the current sessionId
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      // otherwise catch error
      console.log(error);
    }
  };

  const openLink = async () => {
    // like some FAQ link
    WebBrowser.openBrowserAsync("https://galaxies.dev");
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Image
        style={styles.loginImage}
        source={require("@/assets/images/todoist-logo.png")}
      />
      <Image
        style={styles.bannerImage}
        source={require("@/assets/images/login.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 40,
    marginTop: 20,
  },
  loginImage: {
    // Using resize "contain" to resize images with heigh or width keeping the original image ratio
    height: 40,
    resizeMode: "contain",
    alignSelf: "center",
  },
  bannerImage: {
    height: 280,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
