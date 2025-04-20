import { PROJECT_COLORS, DEFAULT_PROJECT_COLOR } from '@/constants/Colors';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { useMMKVString } from 'react-native-mmkv';

const Page = () => {
  const [selected, setSelected] = useState<string>(DEFAULT_PROJECT_COLOR);
  const headerHeight = useHeaderHeight();
  const [bg, setBg] = useMMKVString('bg')

  const onColorSelect = (color: string) => {
    setSelected(color);
    // router.setParams({ bg: color });
    router.setParams({ bg: color}) // doesn't work, so we use key value storage
    // useMMKVString.setItemSync('bg', color)
    setBg(color)
  };

  return (
    <View style={{ marginTop: headerHeight }}>
      <View
        style={{ flexDirection: 'row', flexGrow: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PROJECT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={{
              backgroundColor: color,
              height: 60,
              width: 60,
              margin: 5,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => onColorSelect(color)}>
            {selected === color && (
              <Ionicons name="checkmark" size={24} color={'#fff'} style={{}} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default Page;