import { Tabs } from "@/components/Tabs";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetProvider } from '@/context/BottomSheetContext';
import { Colors } from "@/constants/Colors";
import {
  getIcon,
  calendarIosIconParams,
  calendarGeneralIconParams,
  upcomingIosIconParams,
  searchIosIconParams,
  browseIosIconParams,
  upcomingGeneralIconParams,
  searchGeneralIconParams,
  browseGeneralIconParams
} from "@/utils/icons";
import { TaskBottomSheet } from "@/components/TaskBottomSheet";

const platform = Platform.OS;

const TabLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        tabBarActiveTintColor={Colors.primary}
        tabBarInactiveTintColor={Colors.dark}
        hapticFeedbackEnabled={true}
        ignoresTopSafeArea={true}
        labeled={true}
      >
        <Tabs.Screen
          name="today"
          options={{
            title: "Today",
            tabBarIcon: ({ focused }) => getIcon(platform, focused, calendarIosIconParams, calendarGeneralIconParams),
          }}
        />
        <Tabs.Screen
          name="upcoming"
          options={{
            title: "Upcoming",
            tabBarIcon: ({ focused }) => getIcon(platform, focused, upcomingIosIconParams, upcomingGeneralIconParams),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ focused }) => getIcon(platform, focused, searchIosIconParams, searchGeneralIconParams),
          }}
        />

        <Tabs.Screen
          name="browse"
          options={{
            title: "Browse",
            tabBarIcon: ({ focused }) => getIcon(platform, focused, browseIosIconParams, browseGeneralIconParams),
          }}
        />
      </Tabs>

      <TaskBottomSheet />

    </GestureHandlerRootView>
  );
};

const TabLayoutWrapper = () => (
  <BottomSheetProvider>
    <TabLayout />
  </BottomSheetProvider>
);

export default TabLayoutWrapper;

const styles = StyleSheet.create({});

