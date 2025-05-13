import Fab from "@/components/Fab";
import { StyleSheet, View, Text } from "react-native";
import React, { useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { projects, todos } from "@/db/schema";
import { format } from "date-fns";
import { Todo } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import TaskRow from "@/components/TaskRow";
import { Calendar, toLocaleDateString } from "@fowusu/calendar-kit";
import { CalendarMonthName, CustomDayComponent, WeekDayNameComponent } from "@/components/CalendarComponents";

interface Section {
	title: string;
	data: Todo[];
}

const today = new Date();
const todayDateString = toLocaleDateString(today);



const Page = () => {
  const [selectedDay, setSelectedDay] = useState<string>(todayDateString);

  const onDayPress = useCallback((dateString: string) => {
    setSelectedDay(dateString);
  }, []);

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db);

	const today = new Date().toISOString();

	const { data } = useLiveQuery(
		drizzleDb
			.select()
			.from(todos)
			.leftJoin(projects, eq(todos.project_id, projects.id)).
			where(eq(todos.completed, 0))
	)

  return (
    <>
      {/* <Fab /> */}
     <Calendar
      dayContainerStyle={{ backgroundColor: 'transparent' }}
      contentContainerStyle={{ backgroundColor: Colors.background, borderRadius: 12, padding: 8 }}
      weeksContainerStyle={{ backgroundColor: Colors.background }}
      MonthNameComponent={CalendarMonthName}
      WeekDayNameComponent={WeekDayNameComponent}
      DayComponent={CustomDayComponent}
      date={todayDateString}
      markedDates={[selectedDay]}
      onDayPress={onDayPress}
    />
   </>
  );
};

export default Page;

const styles = StyleSheet.create({
	container: {
    backgroundColor: 'red',
    // justifyContent: 'center',
    // alignItems: 'center',
	},
  calendarContainer: {
    backgroundColor: Colors.background,
  },
  dayContainer: {
    backgroundColor: Colors.primary,
  }
});
