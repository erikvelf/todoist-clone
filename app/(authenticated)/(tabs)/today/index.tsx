import { View, Text, StyleSheet } from "react-native";
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
    console.log("Page ~ formattedData", formattedData);

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

    console.log("Page ~ groupedByDay", groupedByDay);

    const listData: Section[] = Object.entries(groupedByDay || {}).map(([day, tasks]) => ({
      title: day,
      data: tasks,
    }));
    console.log("Page ~ listData", listData);

    // Sort sections by date
    listData.sort((a, b) => {
      const dateA = new Date(a.data[0].due_date || new Date());
      const dateB = new Date(b.data[0].due_date || new Date());
      return dateA.getTime() - dateB.getTime();
    });
    console.log("Page ~ listData sorted", listData);


    setSectionListData(listData);

  }, [data]);

  return (
    <View style={styles.container}>
      <Text>Today</Text>
      <Fab />
    </View>
  );
};

export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});