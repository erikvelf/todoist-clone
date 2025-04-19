import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import Fab from "@/components/Fab";
import React from "react";
import {Colors} from "@/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import * as ContextMenu from "zeego/context-menu";
import { Item } from "zeego/context-menu";

const Page = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const {data} = useLiveQuery(drizzleDb.select().from(projects), [])
  const isPro = false;

  const onDeleteProject = async (id: number) => {
    await drizzleDb.delete(projects).where(eq(projects.id, id));
  }

  const onNewProject = async () => {
    if (data.length >= 5 && !isPro) {
      // show go pro modal
      
    } else {
      router.push("./browse/new-project");
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Projects</Text>
          <TouchableOpacity onPress={onNewProject}>
            <Ionicons name="add" size={24} color={Colors.dark}/>
          </TouchableOpacity>
        </View>
        {/* Using FlatList will render only what is visible on the screen unlike the ScrollView */}
        <FlatList
          data={data}

          renderItem={({item}) => (
            <ContextMenu.Root key={item.id}>
              <ContextMenu.Trigger>
                <TouchableOpacity style={styles.projectButton}>
                  <Text style={{color: item.color}}>#</Text>
                  <Text style={styles.projectButtonText}>{item.name}</Text>
                </TouchableOpacity>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                <ContextMenu.Item key="delete" onSelect={() => onDeleteProject(item.id)}>
                  <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                  <ContextMenu.ItemIcon androidIconName="delete" />
                  <ContextMenu.ItemIcon ios={{
                    name: "trash",
                    pointSize: 24,
                  }}/>
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={
            <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <Fab />
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightBorder,
  },
  signOutButton: {
    padding: 14,
    backgroundColor: Colors.background,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  signOutText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  projectButton: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 14,
    borderRadius: 4,
  },
  projectButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
