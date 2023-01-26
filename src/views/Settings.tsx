import React from 'react'
import { useWindowDimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import AccountSettings from '../components/settings/AccountSettings'
import GlobalSettings from '../components/settings/GlobalSettings'

const renderScene = SceneMap({
    accountSettings: AccountSettings,
    globalSettings: GlobalSettings,
})

const renderTabBar = (props: any) => (
    <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'white' }}
        style={{ backgroundColor: '#7b4aef' }}
    />
)

export default function Settings() {
    const layout = useWindowDimensions()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'accountSettings', title: 'Account settings' },
        { key: 'globalSettings', title: 'Global settings' },
    ])

    return (
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    )
}
