import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, PressableProps, StyleSheet, Text } from "react-native"

export const Chip = (props: { icon: keyof typeof Ionicons.glyphMap, label: string, borderColor?: string, iconColor?: string, labelColor?: string } & PressableProps ) => {
    const { icon, label, borderColor, iconColor, labelColor, ...rest } = props;
    return (
        <Pressable style={({ pressed }) => [
            styles.outlinedButton,
            {
                backgroundColor: pressed ? Colors.lightBorder : 'transparent',
                borderColor: borderColor || Colors.lightBorder
            }
        ]} {...rest}>
            <Ionicons name={icon} size={24} color={iconColor || Colors.dark} />
            <Text style={[styles.outlinedButtonText, { color: labelColor || Colors.dark }]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    outlinedButton: {
        borderWidth: StyleSheet.hairlineWidth,
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
    }
})