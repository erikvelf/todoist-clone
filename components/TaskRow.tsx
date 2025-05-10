import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Todo } from "@/types/interfaces";
import { Colors } from "@/constants/Colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSQLiteContext } from "expo-sqlite";
import { projects, todos } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { PROJECT_DEFAULTS } from "@/constants/Defaults";

interface TaskRowProps {
  task: Todo;
}

const TaskRow = ({ task }: TaskRowProps) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const { openBottomSheetWithTask } = useBottomSheet();
  const { data } = useLiveQuery(
    drizzleDb
    .select()
    .from(todos)
    .where(eq(todos.id, Number(task.id)))
    .leftJoin(projects, eq(todos.project_id, projects.id)));
  // important: await drizzleDb.update() to make the data update in the list of uncompleted tasks in Today tab
  const markAsCompleted = async () => {
    await drizzleDb.update(todos).set({ completed: 1, date_completed: Date.now() }).where(eq(todos.id, task.id));
  }

  if (!!data && data.length === 0) {
    return null;
  }

  const todo = {
    ...data[0].todos,
    project_id: data[0].projects?.id ?? PROJECT_DEFAULTS.id,
    project_name: data[0].projects?.name ?? PROJECT_DEFAULTS.name,
    project_color: data[0].projects?.color ?? PROJECT_DEFAULTS.color,
  }

  return (
    <View >
        <TouchableOpacity onPress={() => openBottomSheetWithTask(todo)} style={styles.container}>
          <View style={styles.row}>
            <BouncyCheckbox
              size={25}
              fillColor={task.project_color}
              unFillColor="#fff"
              textContainerStyle={{display: "none"}} // removing the default text container of the BouncyCheckbox
              onPress={markAsCompleted}
            />
            <Text style={styles.name}>{task.name}</Text>
          </View>
          <Text style={styles.projectName}>{task.project_name}</Text>
        </TouchableOpacity>
    </View>
  );
};

export default TaskRow;

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    // justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  projectName: {
    fontSize: 12,
    color: Colors.lightText,
    alignSelf: "flex-end",
  },
});
