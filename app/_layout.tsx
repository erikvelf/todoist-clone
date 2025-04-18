import React from "react";
import {
  router,
  Stack,
  useNavigationContainerRef,
  usePathname,
  useRouter,
  useSegments,
} from "expo-router";
import { tokenCache } from "@/utils/cache";
import { Colors } from "@/constants/Colors";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect } from "react";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { SQLiteProvider } from "expo-sqlite"
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from "@/drizzle/migrations";
import { addDummyData } from "@/utils/addDummyData";
import * as Sentry from '@sentry/react-native';


const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: 'https://bb7de8f6a6b2a73a8e3bf491d6f06b06@o4509169417256960.ingest.de.sentry.io/4509169424007248',
  attachScreenshot: true,
  tracesSampleRate: 1.0, // do profiling, change for production to a lower value

  // Configure Session Replayjj
  replaysSessionSampleRate: 0.1, // for development, set to 1 to capture all sessions
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: true,
      maskAllVectors: false,
      maskAllImages: false,
    }),
  ],


  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: __DEV__,
});


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
  const ref = useNavigationContainerRef();
  useEffect(() => {
    navigationIntegration.registerNavigationContainer(ref);
  }, [ref])
  

  const expoDb = openDatabaseSync("todos");
  const db = drizzle(expoDb);
  const {success, error} = useMigrations(db, migrations);
  console.log("RootLayout ~ success", success);
  console.log("RootLayout ~ error", error);

  React.useEffect(() => {
    if (!success) {
      console.log("Adding dummy data");
      addDummyData(db);
    };

    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <StatusBar style="dark" />
      <ClerkLoaded>
        <Suspense fallback={<Loading/>}>
          <SQLiteProvider databaseName="todos" useSuspense options={{
            enableChangeListener: true, // get live data from the database
          }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <InitialLayout />
              <Toaster />
            </GestureHandlerRootView>
          </SQLiteProvider>
        </Suspense>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

const Loading = () => {
  return <ActivityIndicator size="large" color={Colors.primary} />
}

export default Sentry.wrap(RootLayout);