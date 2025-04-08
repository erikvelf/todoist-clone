import { Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu"
import { useRouter } from "expo-router";
import Icon from "@react-native-vector-icons/ionicons";

// Get the icon source and ensure it's properly typed
const linkIcon: ImageSourcePropType = { uri: Icon.getImageSourceSync("link", 24)?.uri || "" };

type MoreButtonProps = {
  pageName: string;
}

const MoreButton = ({ pageName }: MoreButtonProps) => {
  const router = useRouter();
  return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <TouchableOpacity>
            <Text>{pageName}</Text>
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="link">
          <DropdownMenu.ItemTitle>Copy</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemImage
            source={linkIcon}
            height={24}
            width={24}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MoreButton;
