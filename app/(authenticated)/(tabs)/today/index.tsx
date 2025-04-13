import { View, Text, StyleSheet } from "react-native";
import Fab from "@/components/Fab";
import { useSQLiteContext } from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { todos } from "@/db/schema";

const Page = () => {
  const db = useSQLiteContext();
  useDrizzleStudio(db);
  const drizzleDb = drizzle(db);

  const {data} = useLiveQuery(drizzleDb.select().from(todos))
  console.log("Page ~ data", data);

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
