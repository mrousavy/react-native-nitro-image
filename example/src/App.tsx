/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStaticNavigation } from '@react-navigation/native'
import { CachePriorityTab } from './CachePriorityTab'
import { EmptyTab } from './EmptyTab'
import { FastImageTab } from './FastImageTab'
import { NitroImageTab } from './NitroImageTab'

const Tabs = createBottomTabNavigator({
  detachInactiveScreens: false,
  screens: {
    Empty: EmptyTab,
    FastImage: FastImageTab,
    NitroImage: NitroImageTab,
    CachePriority: CachePriorityTab,
  },
})
const Navigation = createStaticNavigation(Tabs)

function App(): React.JSX.Element {
  return <Navigation />
}

export default App
