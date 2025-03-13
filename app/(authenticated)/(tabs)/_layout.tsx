import { Tabs } from "@/components/Tabs";

const TabLayout = () => {
	// sfSymbol is a lib of icons from an installed icons package
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => ({
						sfSymbol: focused ? "house.fill" : "house",
					}),
				}}
			/>
			<Tabs.Screen
				name="today"
				options={{
					title: "Today",
					tabBarIcon: ({ focused }) => ({
						sfSymbol: focused ? "calendar.circle.fill" : "calendar.circle.fill",
					}),
				}}
			/>
			<Tabs.Screen
				name="upcoming"
				options={{
					title: "Upcoming",
					tabBarIcon: () => ({
						sfSymbol: "calendar",
					}),
				}}
			/>

			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ focused }) => ({
						sfSymbol: focused ? "text.magnifyingglass" : "magnifyingglass",
					}),
				}}
			/>

			<Tabs.Screen
				name="browse"
				options={{
					title: "Browse",
					tabBarIcon: ({ focused }) => ({
						sfSymbol: focused ? "doc.text.image.fill" : "doc.text.image",
					}),
				}}
			/>
		</Tabs>
	);
};

export default TabLayout;
