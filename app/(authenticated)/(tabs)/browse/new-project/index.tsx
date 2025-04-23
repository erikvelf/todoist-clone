import { Colors, DEFAULT_PROJECT_COLOR } from "@/constants/Colors";
import { projects } from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Link, useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { useMMKVString } from 'react-native-mmkv';

const Page = () => {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  // const { bg } = useLocalSearchParams<{ bg: string }>(); // doesn't work, so we use key value storage
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_PROJECT_COLOR);
  const db = useSQLiteContext()
  const drizzleDb = drizzle(db)
  const [bg, setBg] = useMMKVString('bg')
  const headerHeight = useHeaderHeight()

  useEffect(() => {
    console.log("bg", bg);
    if (bg) {
      setSelectedColor(bg);
    }
    setBg('')
  }, [bg]);

  const onCreateProject = async () => {
    await drizzleDb.insert(projects).values({
      name: projectName,
      color: selectedColor,
    });
    setSelectedColor(DEFAULT_PROJECT_COLOR)
    router.dismiss() // go back to the previous screen after selection
  }

  return (
    <View style={{ marginTop: headerHeight }}>
      {/* using Stack.Screen to change the header right button to a button that depends on the inside state of this screen */}
      <Stack.Screen options={{
        headerRight: () => (
          <TouchableOpacity onPress={onCreateProject} disabled={projectName.length === 0}>
            <Text style={projectName.length === 0 ? styles.buttonTextDisabled : styles.buttonText}>Create</Text>
          </TouchableOpacity>
        )
      }}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={projectName}
          onChangeText={setProjectName}
          cursorColor={Colors.primary}
          autoFocus
        />

        <Link href="/browse/new-project/color-select" asChild>
          <TouchableOpacity style={styles.buttonItem}>
            <Ionicons name="color-palette-outline" size={24} color={Colors.primary} />
            <Text style={styles.buttonItemText}>Color</Text>
            <View style={{...styles.colorPreview, backgroundColor: selectedColor}}/>
            <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}

export default Page;

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    fontWeight: 500,
    color: Colors.primary,
  },
  buttonTextDisabled: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark
  },
  container: {
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  input: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightBorder,
    padding: 12,
    fontSize: 16,
  },
  buttonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    gap: 12,
  },
  buttonItemText: {
    fontSize: 16,
    flex: 1,
    fontWeight: 500,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  }
})