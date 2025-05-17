import { Colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import type { InnerDayProps } from "@fowusu/calendar-kit";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { format, startOfDay, endOfDay } from "date-fns";

export interface CalendarMonthNameProps {
  month: Date;
  locale?: string;
}

export const CalendarMonthName: React.FC<CalendarMonthNameProps> = ({ month, locale }) => (
  <View style={{ paddingVertical: 8, borderRadius: 8, marginBottom: 4 }}>
    <Text style={{ color: Colors.dark, fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
      {month.toLocaleDateString(locale || 'en-US', { month: 'long', year: 'numeric' })}
    </Text>
  </View>
);

export interface WeekDayNameComponentProps {
  weekDays: string[];
}

export const WeekDayNameComponent: React.FC<WeekDayNameComponentProps> = ({ weekDays }) => (
  <View style={{ flexDirection: 'row', borderRadius: 8, marginBottom: 4 }}>
    {weekDays.map((day, idx) => (
      <View key={day + idx} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
        <Text style={{ color: Colors.lightText, fontWeight: '600' }}>{day}</Text>
      </View>
    ))}
  </View>
);

// Custom state creator function to determine if a day has todos
export const createDayState = (day: Date) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  
  // Get all incomplete todos
  const { data: allTodos } = useLiveQuery(
    drizzleDb
      .select()
      .from(todos)
      .where(eq(todos.completed, 0))
  );

  // Check if there are any todos for this day
  const hasTodos = allTodos?.some(todo => {
    if (!todo.due_date) return false;
    const todoDate = new Date(todo.due_date);
    return startOfDay(todoDate).getTime() === startOfDay(day).getTime();
  });

  return hasTodos ? 'active' : 'inactive';
};

interface CustomDayProps extends InnerDayProps<Record<string, unknown>> {}

export const CustomDayComponent: React.FC<CustomDayProps> = ({ 
  day, 
  isSelected, 
  isToday, 
  locale,
  state
}) => {
  const hasTodos = state === 'active';
  
  let containerStyle = [styles.dayContainer];
  let textStyle = [styles.dayText];

  return (
    <View style={containerStyle}>
      <Text style={[textStyle, isToday && { color: Colors.primary }]}>
        {day.toLocaleDateString(locale || 'en-US', { day: 'numeric' })}
      </Text>
      <View style={[
        styles.dot, 
        { 
          backgroundColor: isSelected && hasTodos ? Colors.primary : 'transparent'
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  dotCount: {
    fontSize: 10,
    color: Colors.primary,
    marginLeft: 2,
    marginTop: -2,
    fontWeight: 'bold',
    width: 16,
    height: 16,
  },
  dayContainer: {
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    aspectRatio: 1,
    minWidth: 36,
    minHeight: 36,
    backgroundColor: 'transparent',
    padding: 4,
  },
  selectedDayContainer: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 16,
    color: Colors.dark,
  },
  selectedDayText: {
    color: Colors.background,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
})

// Add this hook to get marked dates
export const useMarkedDates = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  
  const { data: incompleteTodos } = useLiveQuery(
    drizzleDb
      .select()
      .from(todos)
      .where(eq(todos.completed, 0))
  );

  return useMemo(() => {
    if (!incompleteTodos) return [];
    
    return incompleteTodos
      .filter(todo => todo.due_date)
      .map(todo => format(new Date(todo.due_date!), 'yyyy-MM-dd'));
  }, [incompleteTodos]);
};