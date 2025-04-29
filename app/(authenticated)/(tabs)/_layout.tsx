import { Tabs } from "@/components/Tabs";
import { Platform, Keyboard, StyleSheet, View, TouchableOpacity, Pressable, Text } from "react-native";
import Icon from "@react-native-vector-icons/ionicons";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetBackdrop, BottomSheetScrollView, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { BottomSheetProvider, useBottomSheet } from '@/context/BottomSheetContext';
import { useRef, useCallback, ElementRef, useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Project, Todo } from "@/types/interfaces";
import { projects, todos } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";

import { useSQLiteContext } from "expo-sqlite";
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
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/components/Chip";
import { eq } from "drizzle-orm";

interface TodoFormData {
  name: string;
  description?: string;
}

interface TodoFormProps {
  todo?: Todo & { project_id: string, project_name: string, project_color: string };
}

const platform = Platform.OS;
const snapPoints = ['25%'];

const TabLayout = ({ todo }: TodoFormProps) => {
  const { bottomSheetRef } = useBottomSheet();
  const taskNameInputRef = useRef<ElementRef<typeof BottomSheetTextInput>>(null);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const { data } = useLiveQuery(drizzleDb.select().from(projects))
  const [selectedProject, setSelectedProject] = useState<Project>(
    todo?.project_id ? {
      id: todo.project_id,
      name: todo.project_name,
      color: todo.project_color
    } : {
      id: 1, // inbox
      name: 'Inbox',
      color: '#000000'
    }
  )

  const { control, handleSubmit, reset, trigger, formState: { errors } } = useForm<TodoFormData>({
    defaultValues: {
      name: todo?.name || '',
      description: todo?.description || ''
    },
    mode: 'onChange' // trigger rerender for the 'create task' button so its opacity is updated
  });

  const handleSheetChanges = useCallback((index: number) => {
    if (index >= 0) {
      taskNameInputRef.current?.focus();
    } else {
      // Reset form when sheet closes
      reset();
      Keyboard.dismiss();
    }
  }, [reset]);

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    if (todo) {
      // update the task
      await drizzleDb.update(todos).set({
        name: data.name,
        description: data.description,
        project_id: selectedProject.id,
        due_date: 0, // TODO: Add due date
      }).where(eq(todos.id, todo.id))
      
    } else {
      // create a new task
      await drizzleDb.insert(todos).values({
        name: data.name,
        description: data.description,
        project_id: selectedProject.id,
        priority: 0,
        date_added: Date.now(),
        completed: 0,
        due_date: 0, // TODO: Add due date
      })
    }
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    trigger()
  }, [trigger])

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

      <BottomSheet
        handleComponent={null}
        enableContentPanningGesture={true}
        style={styles.bottomSheet}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: Colors.lightBorder }}
        backgroundStyle={{ backgroundColor: Colors.background }}
        onChange={handleSheetChanges}
       // enableDynamicSizing={false} // because we set the height manually
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}        // hide backdrop when sheet is closed
            appearsOnIndex={0}          // show backdrop starting at index 0
            pressBehavior="close"
          />
        )}
      // enableHandlePanningGesture={false} // disable dragging to close
      >
      <BottomSheetScrollView keyboardShouldPersistTaps="always" style={styles.bottomSheetScrollViewContainer}>
        <BottomSheetView style={styles.bottomSheetInputs}>
          <Controller
            control={control}
            rules={{
              required: 'Task name is required', // Add validation rule
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <BottomSheetTextInput
                ref={taskNameInputRef}
                placeholder="Name"
                style={styles.titleInput}
                placeholderTextColor={Colors.lightText}
                cursorColor={Colors.primary}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                onSubmitEditing={() => handleSubmit(onSubmit)}
                autoCorrect={false}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            rules={{
              // Add any validation rules for description if needed
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <BottomSheetTextInput
                placeholder="Description"
                style={styles.descriptionInput}
                placeholderTextColor={Colors.lightText}
                cursorColor={Colors.primary}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="description"
          />
          <BottomSheetScrollView
            keyboardShouldPersistTaps="always" // very useful!
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.actionButtonsContainer}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <Chip icon="flag-outline" label="Priority" />
            <Chip icon="calendar-outline" label="Date" />
            <Chip icon="location-outline" label="Location" />
            <Chip icon="pricetags-outline" label="Label" />
            <Chip icon="time-outline" label="Time" />
          </BottomSheetScrollView>
        </BottomSheetView>

        <BottomSheetView style={styles.bottomSheetFooter}>
          <Pressable style={({ pressed }) => [
            styles.outlinedButton,
            {
              backgroundColor: pressed ? Colors.lightBorder : 'transparent'
            }
          ]}>
            <Text style={styles.outlinedButtonText}><Text style={{ color: Colors.primary }}># </Text>Project</Text>
          </Pressable>
          <Pressable style={{ ...styles.submitButton, opacity: errors.name ? 0.5 : 1 }} onPress={handleSubmit(onSubmit)}>
            <Ionicons name="arrow-up-outline" size={24} color={"#ffffff"} />
          </Pressable>
        </BottomSheetView>
      </BottomSheetScrollView>
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
  bottomSheet: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  bottomSheetInputs: {
    flex: 0,
    gap: 12,
  },
  titleInput: {
    paddingHorizontal: 16,
    fontSize: 20,
  },
  descriptionInput: {
    paddingHorizontal: 16,
    fontSize: 18,
  },
  inputError: {
    borderColor: 'red', // Highlight input with error
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 50,
    maxHeight: 50,
  },
  bottomSheetFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlinedButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    maxHeight: 40,
    minWidth: 80,
    // maxWidth: 200,
    gap: 8,
  },
  outlinedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
  },
  bottomSheetScrollViewContainer: {
    flex: 1,
    paddingVertical: 16,
    marginBottom: 16,
  }
});

