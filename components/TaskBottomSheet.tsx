import React, { useRef, useCallback, ElementRef, useState, useEffect } from 'react';
import { Platform, Keyboard, StyleSheet, View, Pressable, Text } from 'react-native';
import { BottomSheetView, BottomSheetTextInput, BottomSheetScrollView } from '@gorhom/bottom-sheet';
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

interface TodoFormData {
  name: string;
  description?: string;
}

interface TaskFormProps {
  todo?: Todo & { project_id: string, project_name: string, project_color: string };
}

export const TaskBottomSheetContent: React.FC = () => {
  const router = useRouter();
  const { closeSheet, openSheet, sheetContent, sheetProps } = useBottomSheet();
  const taskNameInputRef = useRef<ElementRef<typeof BottomSheetTextInput>>(null);

  const { todo } = (sheetProps as TaskFormProps) || {};

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const { data: projectList } = useLiveQuery(drizzleDb.select().from(projects));

  const [selectedProject, setSelectedProject] = useState<Project>(() => 
    todo?.project_id ? {
      id: todo.project_id,
      name: todo.project_name,
      color: todo.project_color
    } : {
      id: 1, name: 'Inbox', color: '#000000'
    }
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => 
    todo?.due_date ? new Date(todo.due_date) : new Date()
  );

  const [previouslySelectedDate, setPreviouslySelectedDate] = useMMKVString('selectedDate');

  const { control, handleSubmit, reset, trigger, formState: { errors } } = useForm<TodoFormData>({
    defaultValues: {
      name: todo?.name || '',
      description: todo?.description || ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (previouslySelectedDate) {
      setSelectedDate(new Date(previouslySelectedDate));
      setPreviouslySelectedDate(undefined);
    }
  }, [previouslySelectedDate, setPreviouslySelectedDate]);

  useEffect(() => {
    setSelectedProject(
      todo?.project_id
        ? { id: todo.project_id, name: todo.project_name, color: todo.project_color }
        : { id: 1, name: 'Inbox', color: '#000000' }
    );
    setSelectedDate(todo?.due_date ? new Date(todo.due_date) : new Date());
    reset({ name: todo?.name || '', description: todo?.description || '' });
    if (sheetContent === 'TASK_FORM') {
       setTimeout(() => taskNameInputRef.current?.focus(), 100);
     }

  }, [todo, sheetContent, reset]);

  const handleDateSelect = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
  }, []);

  const changeDate = () => {
    openSheet('DATE_SELECTOR', { currentDate: selectedDate, onSelect: handleDateSelect });
    console.log("Opening Date Selector Sheet");
  };

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    try {
      if (todo) {
        await drizzleDb.update(todos).set({
          name: data.name,
          description: data.description,
          project_id: selectedProject.id,
          due_date: selectedDate.getTime(),
        }).where(eq(todos.id, todo.id));
      } else {
        await drizzleDb.insert(todos).values({
          name: data.name,
          description: data.description,
          project_id: selectedProject.id,
          priority: 0,
          date_added: Date.now(),
          completed: 0,
          due_date: selectedDate.getTime(),
        });
      }
      closeSheet();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  useEffect(() => {
    if (sheetContent === 'TASK_FORM') {
        trigger();
    }
  }, [sheetContent, trigger]);

  if (sheetContent !== 'TASK_FORM') {
    return null;
  }

  return (
    <>
      <BottomSheetView style={styles.bottomSheetInputs}>
        <Controller
          control={control}
          rules={{ required: 'Task name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <BottomSheetTextInput
              ref={taskNameInputRef}
              placeholder="Name"
              style={[styles.titleInput, errors.name ? styles.inputError : null]}
              placeholderTextColor={Colors.lightText}
              cursorColor={Colors.primary}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              onSubmitEditing={() => handleSubmit(onSubmit)()}
              autoCorrect={false}
            />
          )}
          name="name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller
          control={control}
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
          keyboardShouldPersistTaps="always"
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.actionButtonsContainer}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <Chip icon="calendar-outline" label="Date" onPress={changeDate} />
          <Chip icon="flag-outline" label="Priority" onPress={() => console.log("Priority chip pressed")} />
          <Chip icon="location-outline" label="Location" onPress={() => console.log("Location chip pressed")} />
          <Chip icon="pricetags-outline" label="Label" onPress={() => console.log("Label chip pressed")} />
          <Chip icon="time-outline" label="Time" onPress={() => console.log("Time chip pressed")} />
        </BottomSheetScrollView>
      </BottomSheetView>

      <BottomSheetView style={styles.bottomSheetFooter}>
        <Pressable style={({ pressed }) => [
          styles.outlinedButton,
          { backgroundColor: pressed ? Colors.lightBorder : 'transparent' }
        ]}
        onPress={() => console.log("Project selector pressed")}
        >
          <Text style={styles.outlinedButtonText}><Text style={{ color: selectedProject?.color || Colors.primary }}># </Text>{selectedProject?.name || 'Project'}</Text>
        </Pressable>

        <Pressable
            style={({ pressed }) => [
            styles.submitButton,
            { opacity: errors.name || !control._formValues.name ? 0.5 : (pressed ? 0.8 : 1) }
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={!!errors.name || !control._formValues.name}
        >
          <Ionicons name="arrow-up-outline" size={24} color={"#ffffff"} />
        </Pressable>
      </BottomSheetView>
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetInputs: {
    gap: 12,
    paddingHorizontal: 16,
  },
  titleInput: {
    fontSize: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder,
    paddingBottom: 8,
  },
  descriptionInput: {
    fontSize: 16,
    minHeight: 60,
  },
  inputError: {
    borderColor: 'red',
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    height: 50,
    maxHeight: 50,
    marginTop: 8,
  },
  bottomSheetFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    maxHeight: 40,
    minWidth: 80,
    gap: 4,
  },
  outlinedButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
  },
}); 