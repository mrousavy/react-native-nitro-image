/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FastImageTab } from "./FastImageTab";
import { NitroImageTab } from "./NitroImageTab";
import { createStaticNavigation } from "@react-navigation/native";
import { EmptyTab } from "./EmptyTab";
import { NitroAssetImageTab } from "./NitroAssetImageTab";

const Tabs = createBottomTabNavigator({
	detachInactiveScreens: false,
	screens: {
		Empty: EmptyTab,
		FastImage: FastImageTab,
		NitroImage: NitroImageTab,
		NitroMediaLibraryImage: NitroAssetImageTab,
	},
});
const Navigation = createStaticNavigation(Tabs);

function App(): React.JSX.Element {
	return <Navigation />;
}

export default App;
