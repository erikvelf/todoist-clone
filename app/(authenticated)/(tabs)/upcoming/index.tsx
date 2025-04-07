import Fab from "@/components/Fab";
import { View, Text, StyleSheet } from "react-native";

const Page = () => {
	return (
		<View style={styles.container}>
			<Text>Page</Text>
			<Fab />
		</View>
	);
};

export default Page;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
