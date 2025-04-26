import { Tabs } from "@/components/Tabs";
import { ImageSourcePropType, Platform, Keyboard, StyleSheet, View, Button, TouchableOpacity } from "react-native";
import Icon from "@react-native-vector-icons/ionicons";
import { Colors } from "@/constants/Colors";
import { AppleIcon } from "react-native-bottom-tabs";
import { generalIconParams, iosIconParams } from "@/types/icons";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { BottomSheetProvider, useBottomSheet } from '@/context/BottomSheetContext';
import { useRef, useCallback, ElementRef } from "react";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Todo } from "@/types/interfaces";
import { getIcon,
  calendarIosIconParams,
  calendarGeneralIconParams,
  upcomingIosIconParams,
  searchIosIconParams,
  browseIosIconParams,
  upcomingGeneralIconParams,
  searchGeneralIconParams,
  browseGeneralIconParams
} from "@/utils/icons";

const platform = Platform.OS;
const snapPoints = ['30%'];

interface TodoFormData {
  name: string;
  description?: string;
}

interface TodoFormProps {
  todo?: Todo & {project_id: string, project_name: string, project_color: string};
}

const TabLayout = ({ todo }: TodoFormProps) => {
  const { bottomSheetRef } = useBottomSheet();
  const taskNameInputRef = useRef<ElementRef<typeof BottomSheetTextInput>>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index >= 0) {
      taskNameInputRef.current?.focus();
    }
  }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        tabBarActiveTintColor={Colors.primary}
        tabBarInactiveTintColor={Colors.dark}
        hapticFeedbackEnabled={true}
        ignoresTopSafeArea={true}
        labeled
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

      <BottomSheet
        style={styles.bottomSheet}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: Colors.lightBorder }}
        backgroundStyle={{ backgroundColor: Colors.backgroundAlt }}
        onChange={handleSheetChanges}
        enableDynamicSizing={false} // because we set the height manually
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}        // hide backdrop when sheet is closed
            appearsOnIndex={ 0 }          // show backdrop starting at index 0
            pressBehavior="close"         // tap backdrop to close
          />
        )}
        enableHandlePanningGesture={false}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <BottomSheetTextInput
            ref={taskNameInputRef}
            placeholder="Task name"
            style={styles.input}
            placeholderTextColor={Colors.lightText}
            cursorColor={Colors.primary}
          />
          <BottomSheetTextInput
            placeholder="Description (optional)"
            style={[styles.input, styles.descriptionInput]}
            placeholderTextColor={Colors.lightText}
            cursorColor={Colors.primary}
            multiline={true}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const TabLayoutWrapper = () => (
  <BottomSheetProvider>
    <TabLayout />
  </BottomSheetProvider>
);

export default TabLayoutWrapper;

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.backgroundAlt,
  },
  input: {
    marginTop: 16,
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.dark,
    backgroundColor: Colors.background,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  bottomSheet: {
    // backgroundColor: Colors.backgroundAlt,
  },
});
