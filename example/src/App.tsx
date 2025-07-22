/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { EmptyTab } from "./EmptyTab";
import { FastImageTab } from "./FastImageTab";
import { NitroImageTab } from "./NitroImageTab";

const Tabs = createBottomTabNavigator({
    detachInactiveScreens: false,
    screens: {
        Empty: EmptyTab,
        FastImage: FastImageTab,
        NitroImage: NitroImageTab,
    },
});
const Navigation = createStaticNavigation(Tabs);

function App(): React.JSX.Element {
    return <Navigation />;
}

export default App;
