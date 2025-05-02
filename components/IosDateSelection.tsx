import React from 'react';
import DateTimePicker, { AndroidNativeProps, IOSNativeProps, WindowsNativeProps } from "@react-native-community/datetimepicker";
import { Colors } from '@/constants/Colors';

export default function IosDateSelection (props: IOSNativeProps) {
    return (
        <DateTimePicker
          accentColor={Colors.primary}
          value={new Date(props.value)}
          onChange={props.onChange}
        />
    )
}
