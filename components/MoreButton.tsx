import { Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu"
import { useRouter } from "expo-router";
import Icon from "@react-native-vector-icons/ionicons";
import * as Clipboard from "expo-clipboard"
import { toast } from "sonner-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";


type MoreButtonProps = {
  pageName: string;
}

const MoreButton = ({ pageName }: MoreButtonProps) => {
  const router = useRouter();

  const copyToClipboard = () => {
    const path = `eriktodos://(authenticated)/(tabs)/${pageName.toLowerCase()}`;
    Clipboard.setStringAsync(path)
    toast.success("Copied to clipboard")
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal-outline" size={30} color={Colors.primary}/>
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="link" onSelect={copyToClipboard}>
          <DropdownMenu.ItemTitle>Copy</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemImage
            source={{ uri: Icon.getImageSourceSync("copy", 24)?.uri || "" }}
            height={24}
            width={24}
          />
        </DropdownMenu.Item>


      <DropdownMenu.Group>
          <DropdownMenu.Item key="select">
            <DropdownMenu.ItemTitle>Select Task</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemImage
              source={{ uri: Icon.getImageSourceSync("albums-outline", 24)?.uri || "" }}
              height={24}
              width={24}
            />
          </DropdownMenu.Item>

          <DropdownMenu.Item key="view">
            <DropdownMenu.ItemTitle>View</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemImage
              source={{ uri: Icon.getImageSourceSync("eye", 24)?.uri || "" }}
              height={24}
              width={24}
            />
        </DropdownMenu.Item>

          <DropdownMenu.Item key="activity">
            <DropdownMenu.ItemTitle>Activity Log</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemImage
              source={{ uri: Icon.getImageSourceSync("time", 24)?.uri || "" }}
              height={24}
              width={24}
            />
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MoreButton;
