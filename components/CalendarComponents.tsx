import { Colors } from "@/constants/Colors";
import { View, Text } from "react-native";
import React from "react";
import type { InnerDayProps } from "@fowusu/calendar-kit";

export interface CalendarMonthNameProps {
  month: Date;
  locale?: string;
}

export const CalendarMonthName: React.FC<CalendarMonthNameProps> = ({ month, locale }) => (
  <View style={{ backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 8, marginBottom: 4 }}>
    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
      {month.toLocaleDateString(locale || 'en-US', { month: 'long', year: 'numeric' })}
    </Text>
  </View>
);

export interface WeekDayNameComponentProps {
  weekDays: string[];
}

export const WeekDayNameComponent: React.FC<WeekDayNameComponentProps> = ({ weekDays }) => (
  <View style={{ flexDirection: 'row', backgroundColor: Colors.primary, borderRadius: 8, marginBottom: 4 }}>
    {weekDays.map((day, idx) => (
      <View key={day + idx} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>{day}</Text>
      </View>
    ))}
  </View>
);

export const CustomDayComponent: React.FC<InnerDayProps<Record<string, unknown>>> = ({ day, isSelected, isToday, state, locale }) => {
  // const isToday = day.toDateString() === today.toDateString();
  const backgroundColor = isSelected 
    ? Colors.primary 
    : 'transparent';


  return (
    <View style={{
      backgroundColor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 2,
      aspectRatio: 1,
      minWidth: 36,
      minHeight: 36,
    }}>
      <Text style={{ color: isSelected ? '#fff' : Colors.dark, fontWeight: isSelected ? 'bold' : 'normal', fontSize: 16 }}>
        {day.toLocaleDateString(locale || 'en-US', { day: 'numeric' })}
      </Text>
    </View>
  );
};