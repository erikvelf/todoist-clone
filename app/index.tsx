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
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAppleOAuth}>
          <Ionicons name="logo-apple" size={24} />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    gap: 20,
    marginHorizontal: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 12,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
