import { Colors } from "@/constants/Colors";
import { View, StyleSheet, TextInput, Text, ScrollView } from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Project, Todo } from "@/types/interfaces";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { projects } from "@/db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

interface TodoFormProps {
    todo?: Todo & { project_name: string, project_color: string, project_id: string };
}

interface TodoFormData {
    name: string;
    description: string;
}

const TodoForm = ({ todo }: TodoFormProps) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const { control, register, trigger, formState: { errors }, handleSubmit } = useForm<TodoFormData>({defaultValues: {
    name: todo?.name || "",
    description: todo?.description || "",
  }});

  const { data } = useLiveQuery(drizzleDb.select().from(projects), [])
  const [selectedProject, setSelectedProject] = useState<Project>(
    todo?.project_id ? {
      id: todo.project_id,
      name: todo.project_name,
      color: todo.project_color,
    } : {
      id: 1,
      name: "Inbox",
      color: "#000",
    }
  );

  useEffect(() => {
    trigger();
  }, [trigger])

  const onSubmit: SubmitHandler<TodoFormData> = (data: TodoFormData) => {
    console.log("SUBMIT");
    console.log(data);
  }
  return (
    <View style={{width: "100%", height: "100%"}}>
      <ScrollView style={styles.scrollViewContainer}>
      <Controller
        control={control}
        name="name"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Task name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.titleInput}
            autoFocus={true}
            autoCorrect={false}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.descriptionInput}
            multiline
            autoCorrect={false}
          />
        )}
      />
      </ScrollView>
    </View>
  );
};

export default TodoForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "red",
  },
  scrollViewContainer: {
    backgroundColor: "#fff",
    gap: 12,
    paddingTop: 16,
  },
  titleInput: {
    fontSize: 20,
    paddingHorizontal: 16,
    color: "#000",
  },
  descriptionInput: {
    fontSize: 18,
    paddingHorizontal: 16,
    color: "#000",
  },
  actionButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  }

});
