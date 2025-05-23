import { Button, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAppIconName, setAlternateAppIcon, AlternateAppIcons } from 'expo-alternate-app-icons';
import { toast } from "sonner-native"
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
const ICONS = [
  {
    name: 'Red',
    icon: require('@/assets/images/icon.png'),
  },
  {
    name: 'Blue',
    icon: require('@/assets/images/icon-blue.png'),
  },
  {
    name: 'Green',
    icon: require('@/assets/images/icon-green.png'),
  },
  {
    name: 'Dark',
    icon: require('@/assets/images/icon-dark.png'),
  },
]

const Page = () => {
  console.log('app icon', getAppIconName());
  const [selectedIcon, setSelectedIcon] = useState<string | null>();

  const onChangeSetAppIcon = async (icon: string) => {
    await setAlternateAppIcon(icon.toLowerCase());
    toast.success('App icon changed')
    setSelectedIcon(icon.toLowerCase());
  }

  return (
    <View style={{ flex: 1, padding: 10, borderRadius: 12}}>
      <View style={{ flexDirection: 'column', gap: 10, backgroundColor: Colors.background, borderRadius: 10, padding: 10 }}>
        {ICONS.map((icon) => (
          <TouchableOpacity key={icon.name} onPress={() => onChangeSetAppIcon(icon.name)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={icon.icon} style={{ width: 60, height: 60 }} />
            <Text style={{ fontSize: 16, maxWidth: 50, flex: 1}}>{icon.name}</Text>
          {selectedIcon === icon.name.toLowerCase() && (
            <View>
            <Ionicons name="checkmark" size={30} color={Colors.primary} />
</View>
          )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({})