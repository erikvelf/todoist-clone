import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, PressableProps, StyleSheet, Text } from "react-native"

/**
 * A customizable Chip component that displays a label and an icon.
 * It can be used as a button.
 *
 * @param {object} props - The properties for the Chip component.
 * @param {string} props.label - The text label to display on the chip.
 * @param {string} [props.borderColor] - The color of the chip's border. Defaults to `Colors.lightBorder`.
 * @param {keyof typeof Ionicons.glyphMap} props.icon - The name of the icon to display from `Ionicons.glyphMap`.
 * @param {string} [props.iconColor] - The color of the icon. Defaults to `Colors.dark`.
 * @param {number} [props.iconSize] - The size of the icon. Defaults to 24.
 * @param {string} [props.labelColor] - The color of the label text. Defaults to `Colors.dark`.
 * @param {PressableProps} [props.rest] - Any other props to be passed to the underlying `Pressable` component.
 *
 * @example
 * // Basic usage with required props
 * <Chip label="Inbox" icon="mail-outline" />
 *
 * @example
 * // Customized chip with specific colors and icon size
 * <Chip
 *   label="Priority"
 *   icon="flag-outline"
 *   borderColor="red"
 *   iconColor="red"
 *   labelColor="red"
 *   iconSize={20}
 *   onPress={() => console.log('Priority chip pressed')}
 * />
 *
 * @example
 * // Chip with a different icon
 * <Chip
 *  label="Today"
 *  icon="calendar-outline"
 *  onPress={() => console.log('Calendar chip pressed')}
 * />
 */
export const Chip = (props: {
    label: string,
    borderColor?: string,
    icon: keyof typeof Ionicons.glyphMap,
    iconColor?: string,
    iconSize?: number,
    labelColor?: string
} & PressableProps) => {
    const { icon, label, borderColor, iconColor, labelColor, iconSize = 24, ...rest } = props;
    return (
        <Pressable style={({ pressed }) => [
            styles.outlinedButton,
            {
                backgroundColor: pressed ? Colors.lightBorder : 'transparent',
                borderColor: borderColor || Colors.lightBorder
            }
        ]} {...rest}>
            <Ionicons name={icon} size={iconSize} color={iconColor || Colors.dark} />
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
        gap: 8,
    },
    outlinedButtonText: {
        fontSize: 14,
        fontWeight: '500',
    }
})