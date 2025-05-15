import { Colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";
import React from "react";
import type { InnerDayProps } from "@fowusu/calendar-kit";

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

export const CustomDayComponent: React.FC<InnerDayProps<Record<string, unknown>>> = ({ 
  day, 
  isSelected, 
  isToday, 
  state, 
  locale 
}) => {
  let containerStyle = [styles.dayContainer];
  let textStyle = [styles.dayText];

  if (isSelected) {
    containerStyle.push(styles.selectedDayContainer);
    textStyle.push(styles.selectedDayText);
  } else if (isToday) {
    textStyle.push(styles.todayText);
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        {day.toLocaleDateString(locale || 'en-US', { day: 'numeric' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    backgroundColor: Colors.dark,
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'red',
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
  },
  selectedDayContainer: {
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    aspectRatio: 1,
    minWidth: 36,
    minHeight: 36,
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 16,
  },
  selectedDayText: {
    color: '#fff',
    fontSize: 16,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  }
})