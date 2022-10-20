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
import Ionicons from '@expo/vector-icons/Ionicons'
import { Pressable } from 'react-native'
import { SvgUri } from 'react-native-svg'
import { useEffect, useState } from 'react'
import CreateAccount from './src/views/CreateAccount'
import AccountService from './src/services/AccountService'

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
                                headerLeft: () => (
                                    <SvgUri
                                        width='32'
                                        height='32'
                                        uri={`https://source.boringavatars.com/beam/32/${account}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`}
                                    />
                                ),
                                headerRight: () => (
                                    <Pressable>
                                        <Ionicons name='ios-settings' size={32} color='#fff' />
                                    </Pressable>
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
                    </Stack.Group>
                </Stack.Navigator>
                <StatusBar style='auto' />
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
