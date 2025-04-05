import {
  router,
  Stack,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { tokenCache } from "@/utils/cache";
import { Colors } from "@/constants/Colors";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

const InitialLayout = () => {
  // useRouter the Router object for imperative navigation.
  // const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  // Check for current page
  const segments = useSegments();
  const pathName = usePathname();

  // This useEffect will decide what to do if the user is logged in or not
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    console.log(segments);
    console.log(pathName);

    // checking if our user is authenticated (is in our Auth group)
    const iAuthGroup: boolean = segments[0] === "(authenticated)";

    console.log("isLoaded", isLoaded);
    console.log("isSignedIn", isSignedIn);

    if (isSignedIn && !iAuthGroup) {
      router.replace("/(authenticated)/(tabs)/today");
    } else if (!isSignedIn && pathName != "/") {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn]);

  // A boolean that indicates whether Clerk has completed initialization. Initially `false`, becomes `true` once Clerk loads.
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

/* wrapping up in ClerkProvider with ClerkLoaded to ensure it is loaded */
const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <StatusBar style="dark" />
      <ClerkLoaded>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <InitialLayout />
          <Toaster />
        </GestureHandlerRootView>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayout;
