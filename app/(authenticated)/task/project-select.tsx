import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { projects } from '@/db/schema'
import { Colors } from '@/constants/Colors'
import { useMMKVString } from 'react-native-mmkv'
import { Project } from '@/types/interfaces'
import { useRouter } from 'expo-router';

const Page = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const router = useRouter();
  const { data: projectsData } = useLiveQuery(drizzleDb.select().from(projects));
  const [_, setSelectedProject] = useMMKVString('tempSelectedProjectObject');

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <FlatList
          data={projectsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: projectData }) => (
            <TouchableOpacity style={styles.projectButton} onPress={() => {
              try {
                // item is a complete project object from projectsData
                setSelectedProject(JSON.stringify(projectData));
              } catch (e) {
                console.error("Failed to save selected project to MMKV in project-select:", e);
                // Optionally, inform the user or handle the error further
              }
              router.back();
            }}>
              <Text style={{ color: projectData.color }}>#{projectData.id}</Text>
              <Text style={styles.projectButtonText}>{projectData.name}</Text>
            </TouchableOpacity>)}
        />
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
})