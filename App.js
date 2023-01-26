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
import { useCallback, useEffect, useMemo, useState } from 'react'
import CreateAccount from './src/views/CreateAccount'
import AccountService from './src/services/AccountService'
import SettingsButton from './src/components/SettingsButton'
import Settings from './src/views/Settings'
import ViewMnemonic from './src/views/ViewMnemonic'
import { AccountContext, GlobalSettingsContext } from './src/contexts/Contexts'
import AvatarButton from './src/components/AvatarButton'
import { NativeBaseProvider, extendTheme } from 'native-base'
import Accounts from './src/views/Accounts'
import AddAccountButton from './src/components/AddAccountButton'
import SettingsService from './src/services/SettingsService'

const Stack = createNativeStackNavigator()

const theme = extendTheme({
    colors: {
        // Add new color
        primary: {
            50: '#f5f1ff',
            100: '#d9c9ff',
            200: '#bea3fd',
            300: '#a480f8',
            400: '#8b5cf6',
            500: '#7b4aef',
            600: '#6e3be7',
            700: '#622ddd',
            800: '#5929c9',
            900: '#532caf',
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: 'md',
            },
        },
    },
})

export default function App() {
    // Init account context
    const [accountId, setAccountId] = useState('')
    const setCurrentAccount = useCallback(async (id) => {
        setAccountId(id)
        await AccountService.setCurrentAccount(id)
    })
    const accountContextValue = useMemo(
        () => ({ id: accountId, setCurrentAccount }),
        [accountId, setCurrentAccount]
    )

    // Init GlobalSettings context
    const [allowReadingClipboard, setAllowReadingClipboard] = useState(false)
    const setAllowReadingClipboardCallback = useCallback(async (allow) => {
        await SettingsService.setAllowReadingClipboard(allow)
        setAllowReadingClipboard(allow)
    })
    const globalSettingsContext = useMemo(
        () => ({
            allowReadingClipboard,
            setAllowReadingClipboard: setAllowReadingClipboardCallback,
        }),
        [allowReadingClipboard, setAllowReadingClipboardCallback]
    )

    useEffect(() => {
        async function init() {
            const currentAccount = await AccountService.getCurrentAccount()
            if (currentAccount !== null) {
                setAccountId(currentAccount.id)
            }

            // Init Settings
            setAllowReadingClipboard(await SettingsService.getAllowReadingClipboard())
        }
        init()
    }, [])

    return (
        <NativeBaseProvider theme={theme}>
            <SafeAreaProvider>
                <AccountContext.Provider value={accountContextValue}>
                    <GlobalSettingsContext.Provider value={globalSettingsContext}>
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
                                            headerTitleAlign: 'center',
                                            headerTransparent: true,
                                            headerTintColor: '#fff',
                                            headerTitleStyle: {
                                                fontWeight: 'bold',
                                            },
                                            headerLeft: () => <AvatarButton></AvatarButton>,
                                            headerRight: () => <SettingsButton></SettingsButton>,
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
                                        name='WelcomeCreateAccount'
                                        component={CreateAccount}
                                        options={{
                                            headerBackVisible: false,
                                            title: 'Zerologin',
                                            presentation: 'card',
                                        }}
                                    />
                                    <Stack.Screen
                                        name='CreateAccount'
                                        component={CreateAccount}
                                        options={{
                                            title: 'Zerologin',
                                            presentation: 'card',
                                        }}
                                    />
                                    <Stack.Screen
                                        name='Settings'
                                        component={Settings}
                                        options={{
                                            title: 'Settings',
                                            headerBackTitle: 'Back',
                                        }}
                                    />
                                    <Stack.Screen
                                        name='Accounts'
                                        component={Accounts}
                                        options={{
                                            title: 'Accounts',
                                            headerBackTitle: 'Back',
                                            headerRight: () => (
                                                <AddAccountButton></AddAccountButton>
                                            ),
                                        }}
                                    />
                                </Stack.Group>
                                <Stack.Group screenOptions={{ presentation: 'modal' }}>
                                    <Stack.Screen
                                        name='ViewMnemonic'
                                        component={ViewMnemonic}
                                        options={{ title: 'View Mnemonic' }}
                                    />
                                </Stack.Group>
                            </Stack.Navigator>
                            <StatusBar style='auto' />
                        </NavigationContainer>
                    </GlobalSettingsContext.Provider>
                </AccountContext.Provider>
            </SafeAreaProvider>
        </NativeBaseProvider>
    )
}
