import Fab from "@/components/Fab";
import { StyleSheet, View, Text, SectionList } from "react-native";
import React, { useCallback, useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { projects, todos } from "@/db/schema";
import { format, startOfDay, isSameDay } from "date-fns";
import { Todo } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import TaskRow from "@/components/TaskRow";
import { Calendar, toLocaleDateString } from "@fowusu/calendar-kit";
import { CalendarMonthName, CustomDayComponent, WeekDayNameComponent, useMarkedDates } from "@/components/CalendarComponents";
import { CustomStateCreator } from "@/utils/CustomStateCreator";

interface Section {
	title: string;
	data: Todo[];
}

const todayDateString = toLocaleDateString(new Date());

const Page = () => {
	const [selectedDay, setSelectedDay] = useState<string>(todayDateString);
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db);

	const onDayPress = useCallback((dateString: string) => {
		setSelectedDay(dateString);
	}, []);

	const { data: allTodos } = useLiveQuery(
		drizzleDb
			.select()
			.from(todos)
			.leftJoin(projects, eq(todos.project_id, projects.id))
			.where(eq(todos.completed, 0))
	);

	const [sectionListData, setSectionListData] = useState<Section[]>([]);

	// Calculate marked dates for todos
	const markedDates = useMarkedDates();

	useEffect(() => {
		const formattedData: Todo[] = allTodos?.map((item) => ({
			...item.todos,
			project_name: item.projects?.name,
			project_color: item.projects?.color,
		})) || [];

		const groupedByDay = formattedData.reduce((acc: { [key: string]: Todo[] }, task) => {
			// format the date to be like this: 15 April · Mon
			const day = format(task.due_date || new Date(), 'd MMM · eee');
			if (!acc[day]) {
				acc[day] = [];
			}
			acc[day].push(task);
			return acc;
		}, {});

		const listData: Section[] = Object.entries(groupedByDay).map(([day, tasks]) => ({
			title: day,
			data: tasks,
		}));

		// Sort sections by date
		listData.sort((a, b) => {
			const dateA = new Date(a.data[0].due_date || new Date());
			const dateB = new Date(b.data[0].due_date || new Date());
			return dateA.getTime() - dateB.getTime();
		});

		setSectionListData(listData);
	}, [allTodos]);

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
				date={selectedDay}
				markedDates={markedDates}
				onDayPress={onDayPress}
				customStateCreator={CustomStateCreator}
				viewAs="week"
			/>
			<SectionList
				sections={sectionListData}
				keyExtractor={(item, index) => item.id.toString() + index}
				renderItem={({ item }) => <TaskRow task={item} />}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionHeaderText}>{title}</Text>
					</View>
				)}
				stickySectionHeadersEnabled={false}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	sectionHeader: {
		backgroundColor: Colors.background,
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginTop: 16,
	},
	sectionHeaderText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: Colors.dark,
	},
});

export default Page;
