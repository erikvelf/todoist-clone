import { View, Text, StyleSheet, Button, Pressable, Touchable, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { useMMKVString } from 'react-native-mmkv';
import { Colors, DATE_COLORS } from '@/constants/Colors';
import { addDays, addWeeks, format, nextSaturday } from 'date-fns';
import DateSelectButton from '@/components/DateSelectButton';
// import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import IosDateSelection from '@/components/IosDateSelection';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import getDateObject from '@/utils/getDateObject';

function next(period: "weekend" | "day" | "week"): Date;
function next(period: "day" | "week", amount: number): Date;

function next(period: string, amount: number = 0): Date {
  if (period === "day") {
    return addDays(new Date(), amount);
  }

  if (period === "weekend") {
    return nextSaturday(new Date());
  }

  return addWeeks(new Date(), amount);
}


const Page = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useMMKVString('selectedDate');

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const onSave = (date: Date) => {
    const dateString = date.toISOString();
    setSelectedDate(dateString);
    router.dismiss();
  }

  const updateDate = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = date || new Date();
    onSave(currentDate);
  }

  return (
    <View style={styles.container}>
      <View style={styles.quickButtons}>
        <DateSelectButton
          icon="today-outline"
          label="Today"
          date={format(next("day"), "EEE")}
          color={DATE_COLORS.today}
          onPress={() => onSave(next("day"))}
        />
        <DateSelectButton
          icon="calendar-outline"
          label="Tomorrow"
          date={format(next("day", 1), "EEE")}
          color={DATE_COLORS.tomorrow}
          onPress={() => onSave(next("day", 1))}
        />
        <DateSelectButton
          icon="calendar-outline"
          label="This weekend"
          date={format(next("weekend"), "EEE")}
          color={DATE_COLORS.weekend}
          onPress={() => onSave(next("weekend"))}
        />
        <DateSelectButton
          icon="calendar-outline"
          label='Next week'
          date={format(next("week", 1), "EEE")}
          color={DATE_COLORS.other}
          onPress={() => onSave(next("week", 1))}
        />
      </View>

      <View style={styles.dateSelectContainer}>
        {Platform.OS === 'ios' ?
          <IosDateSelection
            mode="date"
            display="inline"
            accentColor={Colors.primary}
            value={new Date(currentDate)}
            onChange={updateDate}
            style={{justifyContent: 'center', alignItems: 'center'}}
          />
          :
          <Pressable
            style={styles.dateSelectButton}
            onPress={() => {
              DateTimePickerAndroid.open({
                mode: 'date',
                display: 'calendar',
                value: new Date(currentDate),
                onChange: updateDate,
                minimumDate: new Date(),
              })
            }}
          >
            <Text style={styles.dateSelectButtonText}>Change date from "{getDateObject(new Date(currentDate)).name}"</Text>
          </Pressable>
        }
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: 'center'
  },
  quickButtons: {
    width: '100%',
    gap: 30,
    paddingVertical: 20,
  },
  quickButton: {
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: Colors.dark,
  },
  quickButtonDate: {
    fontSize: 16,
    color: Colors.dark,
  },
  dateSelectButton: {
    alignItems: "center",
    width: '100%',
    padding: 14,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    marginTop: 10,
  },
  dateSelectButtonText: {
    color: Colors.background,
    fontWeight: "bold",
  },
  dateSelectContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
  }
})
