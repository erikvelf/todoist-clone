import { useAuth } from "@clerk/clerk-expo";
import { View, Text, Button } from "react-native";

const Page = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Page</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default Page;
