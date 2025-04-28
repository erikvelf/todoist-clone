import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, StyleSheet, Text } from "react-native"

export const Chip = ({ icon, label }: { icon: keyof typeof Ionicons.glyphMap, label: string }) => {
        return (
        <Pressable style={({ pressed }) => [
            styles.outlinedButton,
            {
                backgroundColor: pressed ? Colors.lightBorder : 'transparent'
            }
        ]}>
            <Ionicons name={icon} size={24} color={Colors.dark} />
            <Text style={styles.outlinedButtonText}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    outlinedButton: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.lightBorder,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        maxHeight: 40,
        minWidth: 80,
        // maxWidth: 200,
        gap: 8,
    },
    outlinedButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.dark,
    }
})