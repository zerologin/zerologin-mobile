import 'text-encoding-polyfill'
import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'
import { Buffer } from 'buffer'
if (!global.Buffer) global.Buffer = Buffer

import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Scan from './src/views/Scan'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import CreateAccount from './src/views/CreateAccount'
import AccountService from './src/services/AccountService'
import AccountSettingsButton from './src/components/AccountSettingsButton'
import AccountSettings from './src/views/AccountSettings'
import ViewMnemonic from './src/views/ViewMnemonic'
import { AccountContext } from './src/contexts/Contexts'
import AvatarButton from './src/components/AvatarButton'

const Stack = createNativeStackNavigator()

export default function App() {
    const [account, setAccount] = useState('')
    useEffect(() => {
        async function init() {
            const currentAccount = await AccountService.getCurrentAccount()
            if (currentAccount !== null) {
                setAccount(currentAccount.id)
            }
        }
        init()
    }, [])

    return (
        <SafeAreaProvider>
            <AccountContext.Provider value={account}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Group
                            defaultScreenOptions={{
                                headerTransparent: true,
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}>
                            <Stack.Screen
                                name='Scan'
                                component={Scan}
                                options={{
                                    title: 'Zerologin',
                                    headerTransparent: true,
                                    headerTintColor: '#fff',
                                    headerTitleStyle: {
                                        fontWeight: 'bold',
                                    },
                                    headerLeft: () => <AvatarButton></AvatarButton>,
                                    headerRight: () => (
                                        <AccountSettingsButton></AccountSettingsButton>
                                    ),
                                }}
                            />
                        </Stack.Group>
                        <Stack.Group
                            screenOptions={{
                                headerTintColor: '#000',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}>
                            <Stack.Screen
                                name='CreateAccount'
                                component={CreateAccount}
                                options={{
                                    title: 'Generate or import your 24 words',
                                    presentation: 'modal',
                                }}
                            />
                            <Stack.Screen
                                name='AccountSettings'
                                component={AccountSettings}
                                options={{
                                    title: 'Account settings',
                                    headerBackTitle: 'Back',
                                }}
                            />
                            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                                <Stack.Screen
                                    name='ViewMnemonic'
                                    component={ViewMnemonic}
                                    options={{ title: 'View Mnemonic' }}
                                />
                            </Stack.Group>
                        </Stack.Group>
                    </Stack.Navigator>
                    <StatusBar style='auto' />
                </NavigationContainer>
            </AccountContext.Provider>
        </SafeAreaProvider>
    )
}
