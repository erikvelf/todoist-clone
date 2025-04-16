import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Todo } from "@/types/interfaces";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSQLiteContext } from "expo-sqlite";
import { todos } from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
interface TaskRowProps {
  task: Todo;
}

const TaskRow = ({ task }: TaskRowProps) => {
  const db = useSQLiteContext()
  const drizzleDb = drizzle(db);

  // important: await drizzleDb.update() to make the data update in the list of uncompleted tasks in Today tab
  const markAsCompleted = async () => {
    await drizzleDb.update(todos).set({ completed: 1, date_completed: Date.now() }).where(eq(todos.id, task.id));
  }

  return (
    <View >
      <Link href={`/task/${task.id}`} asChild style={styles.container}>
        <TouchableOpacity>
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
      </Link>
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
