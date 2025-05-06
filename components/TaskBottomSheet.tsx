import React, { useRef, useCallback, ElementRef, useState, useEffect } from "react";
import { Keyboard, StyleSheet, Pressable, Text, Modal, Dimensions, View, Animated, TouchableOpacity, FlatList } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetTextInput, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Project, Todo } from "@/types/interfaces";
import { projects, todos } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/components/Chip";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import getDateObject from "@/utils/getDateObject";

interface TodoFormData {
  name: string;
  description?: string;
}

// Renamed props interface for clarity within this component
interface TaskBottomSheetProps {
  todo?: Todo & { project_id: string, project_name: string, project_color: string };
}

const snapPoints = ['25%'];

export const TaskBottomSheet = ({ todo }: TaskBottomSheetProps) => {
  const router = useRouter();
  const { bottomSheetRef } = useBottomSheet();
  const taskNameInputRef = useRef<ElementRef<typeof BottomSheetTextInput>>(null);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const { data: projectsData } = useLiveQuery(drizzleDb.select().from(projects));
  const [selectedProject, setSelectedProject] = useState<Project>(
    todo?.project_id ? {
      id: Number(todo.project_id),
      name: todo.project_name,
      color: todo.project_color
    } : {
      id: 1, // inbox
      name: 'Inbox',
      color: '#000000'
    }
  );

  const [selectedDate, setSelectedDate] = useState<Date>(
    todo?.due_date ? new Date(todo.due_date) : new Date()
  );

  const [previouslySelectedDate, setPreviouslySelectedDate] = useMMKVString('selectedDate');
  const [previouslySelectedProject, setPreviouslySelectedProject] = useMMKVString('tempSelectedProjectObject');

  useEffect(() => {
    if (previouslySelectedDate) {
      setSelectedDate(new Date(previouslySelectedDate));
      setPreviouslySelectedDate(undefined);
    }
  }, [previouslySelectedDate, setPreviouslySelectedDate]);

  useEffect(() => {
    if (previouslySelectedProject) {
      try {
        // const projectFromMMKV = JSON.parse(previouslySelectedProject) as Project;
        setSelectedProject(() => JSON.parse(previouslySelectedProject) as Project);
      } catch (e) {
        console.error("Failed to parse project from MMKV in TaskBottomSheet:", e);
      } finally {
        setPreviouslySelectedProject(undefined); // Clear after processing
      }
    }
  }, [previouslySelectedProject, setSelectedProject, setPreviouslySelectedProject]);

  const { control, handleSubmit, reset, trigger, formState: { errors, isValid } } = useForm<TodoFormData>({
    defaultValues: {
      name: todo?.name || '',
      description: todo?.description || ''
    },
    mode: 'onChange'
  });

  const handleSheetChanges = useCallback((index: number) => {
    if (index >= 0) {
      taskNameInputRef.current?.focus();
    } else {
      // Reset form when sheet closes
      reset({ name: '', description: '' }); // Reset explicitly
      setSelectedDate(new Date()); // Reset date
      // Reset project if necessary, e.g., back to Inbox
      setSelectedProject({ id: 1, name: 'Inbox', color: '#000000' });
      Keyboard.dismiss();
    }
  }, [reset, setSelectedDate, setSelectedProject]);

  // Effect to trigger validation on mount/todo change
  useEffect(() => {
    if (todo) {
      reset({ name: todo.name, description: todo.description || '' });
      setSelectedDate(todo.due_date ? new Date(todo.due_date) : new Date());
      setSelectedProject({
        id: Number(todo.project_id),
        name: todo.project_name,
        color: todo.project_color
      });
    } else {
      // Reset if no todo is passed (e.g., opening for new task)
      reset({ name: '', description: '' });
      setSelectedDate(new Date());
      setSelectedProject({ id: 1, name: 'Inbox', color: '#000000' });
    }
    trigger(); // Trigger validation after reset/initial load
  }, [todo, reset, trigger, setSelectedDate, setSelectedProject]);


  const changeDate = () => {
    const dateString = selectedDate.toISOString();
    setPreviouslySelectedDate(dateString);
    router.push('/task/date-select');
    // Snappping down the bottom sheet before navigating
    bottomSheetRef.current?.snapToIndex(1);
    Keyboard.dismiss();
  };

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    if (!isValid) return; // Prevent submission if form is invalid

    try {
      if (todo) {
        // update the task
        await drizzleDb.update(todos).set({
          name: data.name.trim(),
          description: data.description?.trim(),
          project_id: selectedProject.id,
          due_date: selectedDate.getTime(),
        }).where(eq(todos.id, todo.id));
        console.log('Task updated:', todo.id);
      } else {
        // create a new task
        const result = await drizzleDb.insert(todos).values({
          name: data.name.trim(),
          description: data.description?.trim(),
          project_id: selectedProject.id,
          priority: 0,
          date_added: Date.now(),
          completed: 0, // false
          due_date: selectedDate.getTime(),
        }).returning({ insertedId: todos.id });
        console.log('Task created:', result[0]?.insertedId);
      }
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Error saving task:", error);
      // TODO: Show user feedback about the error
    }
  };

  return (
    <BottomSheet
      handleComponent={null}
      enableContentPanningGesture={true}
      style={styles.bottomSheet}
      ref={bottomSheetRef}
      index={-1} // Start closed
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: Colors.lightBorder }}
      backgroundStyle={{ backgroundColor: Colors.background }}
      onChange={handleSheetChanges}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          onPress={() => {
            Keyboard.dismiss();
            bottomSheetRef.current?.close();
          }}
        />
      )}
    >
      <BottomSheetScrollView keyboardShouldPersistTaps="always" style={styles.bottomSheetScrollViewContainer}>
        <BottomSheetView style={styles.bottomSheetInputs}>
          <Controller
            control={control}
            rules={{
              required: 'Task name is required',
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <BottomSheetTextInput
                  ref={taskNameInputRef}
                  placeholder="Task name"
                  style={styles.titleInput}
                  placeholderTextColor={Colors.lightText}
                  cursorColor={Colors.primary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={() => handleSubmit(onSubmit)} // Allow submit via keyboard
                  autoCorrect={false}
                />
              </>
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
                autoCorrect={false}
                value={value || ''} // Ensure value is not undefined
              />
            )}
            name="description"
          />
          <BottomSheetScrollView
            keyboardShouldPersistTaps="always"
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.actionButtonsContainer}
            contentContainerStyle={{ alignItems: 'center', gap: 8 }} // Added gap
          >
            <Chip icon="calendar-outline"
              iconColor={getDateObject(selectedDate).color}
              label={getDateObject(selectedDate).name}
              onPress={changeDate}
              borderColor={getDateObject(selectedDate).color}
              labelColor={getDateObject(selectedDate).color}
            />
            <Chip icon="flag-outline" label="Priority" onPress={() => console.log("Priority Pressed")} />
            <Chip icon="location-outline" label="Location" onPress={() => console.log("Location Pressed")} />
            <Chip icon="pricetags-outline" label="Label" onPress={() => console.log("Label Pressed")} />
            <Chip icon="time-outline" label="Time" />
          </BottomSheetScrollView>
        </BottomSheetView>

        <BottomSheetView style={styles.bottomSheetFooter}>
          <Pressable style={({ pressed }) => [
            styles.outlinedButton,
            {
              backgroundColor: pressed ? Colors.lightBorder : 'transparent',
              borderColor: Colors.lightBorder
            }
          ]}
            onPress={() => {
              bottomSheetRef.current?.snapToIndex(1);
              Keyboard.dismiss();
              try {
                setPreviouslySelectedProject(JSON.stringify(selectedProject));
              } catch (e) {
                console.error("Failed to save current project to MMKV in TaskBottomSheet:", e);
              }
              router.push('/task/project-select');
            }}
          >
            <Ionicons name={selectedProject.id == 1 ? "file-tray-outline" : "caret-down"} size={selectedProject.id == 1 ? 20 : 14} color={Colors.dark} />
            <Text style={[styles.outlinedButtonText, { color: selectedProject.color }]}>{selectedProject.name}</Text>
            <Ionicons name={selectedProject.id == 1 ? "caret-down" : "caret-up"} size={20} color={Colors.dark} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { opacity: !isValid || pressed ? 0.6 : 1 } // Use isValid from formState and pressed state
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid} // Disable button if form is invalid
          >
            <Ionicons name="arrow-up-outline" size={24} color={"#ffffff"} />
          </Pressable>
        </BottomSheetView>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

// Styles extracted from _layout.tsx
const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  bottomSheetInputs: {
    paddingHorizontal: 16,
    flex: 0,
    gap: 12,
  },
  titleInput: {
    // paddingHorizontal: 16,
    fontSize: 20,
  },
  descriptionInput: {
    // paddingHorizontal: 16,
    fontSize: 18,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    height: 50,
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
  modalContainer: {
    // don't use flex: 1 here, it will break the modal
    // backgroundColor: '#abcdef',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetScrollViewContainer: {
    flex: 1,
    paddingVertical: 16,
    marginBottom: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    justifyContent: 'center',
    // alignItems: 'center',
    width: Dimensions.get('window').width - 60,
    height: 200,
    borderRadius: 5,
  },
  projectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 5,
    gap: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
  },
  projectButtonText: {
    fontSize: 16,
  },
}); 