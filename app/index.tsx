import * as WebBrowser from "expo-web-browser";
import {
  UseOAuthFlowParams,
  useSSO,
  StartSSOFlowParams,
  useOAuth,
} from "@clerk/clerk-expo";
import { useCallback } from "react";
import { Button, Text, View } from "react-native";

export default function Index() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
