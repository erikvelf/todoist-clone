import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function DateSelectButton({ icon, label, date, color, onPress, ...rest}: { icon: keyof typeof Ionicons.glyphMap, label: string, date: string, color: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickButton} onPress={onPress} {...rest}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={styles.quickButtonText}>{label}</Text>
      <Text style={styles.quickButtonDate}>{date}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  quickButton: {
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightBorder
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
  }
})