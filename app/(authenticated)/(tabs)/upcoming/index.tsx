import Fab from "@/components/Fab";
import { StyleSheet, View, Text, SectionList } from "react-native";
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

	const [sectionListData, setSectionListData] = useState<Section[]>([]);

  useEffect(() => {
    const formattedData: Todo[] = data?.map((item) => ({
      ...item.todos,
      project_name: item.projects?.name,
      project_color: item.projects?.color,
    }));

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
    console.log("Page ~ listData sorted", listData);
    console.log(JSON.stringify(listData, null, 2));

    setSectionListData(listData);

  }, [data]);


	return (
		<>
			<Fab />
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
				viewAs="week"
			/>
      <SectionList
        sections={sectionListData}
        renderItem={({ item }) => <TaskRow task={item} />}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
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
