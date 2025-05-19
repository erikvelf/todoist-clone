import { View, Text, StyleSheet, SectionList, RefreshControl, Button } from "react-native";
import Fab from "@/components/Fab";
import { useSQLiteContext } from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { projects, todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import { format } from "date-fns";
import { Todo } from "@/types/interfaces";
import { useState } from "react";
import TaskRow from "@/components/TaskRow";
import { Colors } from "@/constants/Colors";

interface Section {
  title: string;
  data: Todo[];
}

const Page = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  useDrizzleStudio(db);

  // select all todos from a specific project and show only the ones that are not completed
  const {data} = useLiveQuery(
    drizzleDb
    .select()
    .from(todos)
    .leftJoin(projects, eq(todos.project_id, projects.id)).
    where(eq(todos.completed, 0))
  )

  const [sectionListData, setSectionListData] = useState<Section[]>([]);

  useEffect(() => {
    const formattedData: Todo[] = data?.map((item) => ({
      ...item.todos,
      project_name: item.projects?.name,
      project_color: item.projects?.color,
    }));

    /*
    The reduce function is building an object (acc) where each key is a day (like "10 Jul ' Wed") and the value associated with that key should be a list (an array) of all tasks due on that day.
    The if (!acc[day]) check determines if this is the first time the code has encountered a task for this particular day.
    If it is the first time (!acc[day] is true), the code needs to create a place to store the tasks for that day within the acc object.
    acc[day] = [] creates the property day on the acc object and sets its initial value to an empty array.
    This prepares the list so that the current task (and any future tasks found for the same day) can be added to it using acc[day].push(task).
    Without this line, the subsequent acc[day].push(task) would fail because acc[day] wouldn't exist or wouldn't be an array the first time a task for that day is processed.
    */

    // Group tasks by day
    const groupedByDay = formattedData?.reduce((acc: { [key: string]: Todo[] }, task) => {
      // format the date to be like this: 15 April · Mon
      const day = format(task.due_date || new Date(), 'd MMM · eee');
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(task);
      return acc;
    }, {})

    const listData: Section[] = Object.entries(groupedByDay || {}).map(([day, tasks]) => ({
      title: day,
      data: tasks,
    }));

    // Sort sections by date
    listData.sort((a, b) => {
      const dateA = new Date(a.data[0].due_date || new Date());
      const dateB = new Date(b.data[0].due_date || new Date());
      return dateA.getTime() - dateB.getTime();
    });
    console.log(JSON.stringify(listData, null, 2));

    setSectionListData(listData);

  }, [data]);

  return (
    <View style={styles.container}>
      <SectionList
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        sections={sectionListData}
        renderItem={({ item }) => <TaskRow task={item} />}
        renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
        stickySectionHeadersEnabled={true}
      />
      {/* <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/> */}
      <Fab />
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 16,
    backgroundColor: "#fff",
    fontWeight: "bold",
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder,
  }
});