import { Tabs } from "@/components/Tabs";

const TabLayout = () => {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					// sfSymbol is a lib of icons from an installed icons package
					tabBarIcon: () => ({ sfSymbol: "house" }),
				}}
			/>
		</Tabs>
	);
};
