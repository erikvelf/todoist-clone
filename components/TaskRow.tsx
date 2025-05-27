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
import ReanimatedSwipeable, { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming, Easing, SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { useRef } from "react";
import { useMMKV, useMMKVString } from "react-native-mmkv";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { runOnJS } from "react-native-reanimated";

interface TaskRowProps {
  task: Todo;
}

const THRESHOLD = 100;

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const hasReachedThresholdUp = useSharedValue(false);
  const hasReachedThresholdDown = useSharedValue(false);

  useAnimatedReaction(
    () => drag.value,
    (dragValue) => {
    if (Math.abs(dragValue) > THRESHOLD && !hasReachedThresholdUp.value) {
      hasReachedThresholdUp.value = true;
      hasReachedThresholdDown.value = false;
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    } else if (Math.abs(dragValue) < THRESHOLD && !hasReachedThresholdDown.value) {
      hasReachedThresholdDown.value = true;
      hasReachedThresholdUp.value = false;
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    console.log('showRightProgress:', prog.value);
    console.log('appliedTranslation:', drag.value);
      
    if (Math.abs(drag.value) > THRESHOLD) {
      return {
        backgroundColor: Colors.secondary,
      }
    }

    return {
      backgroundColor: "#8b8a8a",
    }

  });

  return (
    <Reanimated.View style={{flex: 1}}>
      <Reanimated.View style={[styles.rightAction, animatedStyle]}>
        <Ionicons name="calendar" size={24} color="white" />
      </Reanimated.View>
    </Reanimated.View>
  );
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
  const [previouslySelectedDate, setPreviouslySelectedDate] = useMMKVString('selectedDate')
  const router = useRouter()

  const heightAnimation = useSharedValue(70);
  const opacityAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation.value,
      height: heightAnimation.value,
    }
  })

  const reanimatedRef = useRef<SwipeableMethods>(null);

  const markAsCompleted = async () => {
    heightAnimation.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
    opacityAnimation.value = withTiming(0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    await drizzleDb.update(todos).set({ completed: 1, date_completed: Date.now() }).where(eq(todos.id, task.id));
  }

  const onSwipeableWillOpen = () => {
    setPreviouslySelectedDate(new Date(task.due_date || 0).toISOString())
    reanimatedRef.current?.close()
    router.push("/(authenticated)/task/date-select")

  }

  const todo = {
    ...data[0]?.todos,
    project_id: data[0]?.projects?.id ?? PROJECT_DEFAULTS.id,
    project_name: data[0]?.projects?.name ?? PROJECT_DEFAULTS.name,
    project_color: data[0]?.projects?.color ?? PROJECT_DEFAULTS.color,
  }


  if (!!data && data.length === 0) {
    return null;
  }

  return (
    <Reanimated.View style={animatedStyle}>
      <ReanimatedSwipeable
        ref={reanimatedRef}
        friction={2}
        rightThreshold={THRESHOLD}
        renderRightActions={RightAction}
        onSwipeableWillOpen={onSwipeableWillOpen}
      >
        <TouchableOpacity onPress={() => openBottomSheetWithTask(todo)} style={styles.container}>
          <View style={styles.row}>
            <BouncyCheckbox
              size={25}
              fillColor={task.project_color}
              unFillColor="#fff"
              textContainerStyle={{ display: "none" }} // removing the default text container of the BouncyCheckbox
              onPress={markAsCompleted}
            />
            <Text style={styles.name}>{task.name}</Text>
          </View>
          <Text style={styles.projectName}>{task.project_name}</Text>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </Reanimated.View>
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
  rightAction: {
    backgroundColor: "red",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    flex: 1,
  },
});
