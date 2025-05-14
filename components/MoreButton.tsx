import { TouchableOpacity } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu"
import * as Clipboard from "expo-clipboard"
import { toast } from "sonner-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";


/**
 * @typedef {object} MoreButtonProps - Props for the MoreButton component.
 * @property {string} pageName - The name of the current page, used to construct a deep link URL.
 */

/**
 * Renders a "more options" button that opens a dropdown menu.
 * The menu includes actions like copying a page link, selecting a task,
 * viewing details, and opening an activity log.
 *
 * @param {MoreButtonProps} props - The props for the component.
 * @returns {JSX.Element} A DropdownMenu component with various options.
 *
 * @example
 * // Usage in a screen component
 * import MoreButton from '@/components/MoreButton';
 *
 * const MyScreen = () => {
 *   return (
 *     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
 *       <Text>Today</Text>
 *       <MoreButton pageName="Today" />
 *     </View>
 *   );
 * }
 */
type MoreButtonProps = {
  pageName: string;
}

const MoreButton = ({ pageName }: MoreButtonProps) => {
  const copyToClipboard = () => {
    const path = `eriktodos://(authenticated)/(tabs)/${pageName.toLowerCase()}`;
    Clipboard.setStringAsync(path)
    toast.success("Copied to clipboard")
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal-outline" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="link" onSelect={copyToClipboard}>
          <DropdownMenu.ItemTitle>Copy</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>

        <DropdownMenu.Group>

          <DropdownMenu.Item key="select">
            <DropdownMenu.ItemTitle>Select Task</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>

          <DropdownMenu.Item key="view">
            <DropdownMenu.ItemTitle>View</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>

          <DropdownMenu.Item key="activity">
            <DropdownMenu.ItemTitle>Activity Log</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>

        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MoreButton;
