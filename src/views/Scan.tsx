import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner'
import { Button, Text } from 'native-base'
import React, { useContext, useEffect, useState } from 'react'
import { AppState, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoginAction from '../components/LoginAction'
import ScanModal, { styles as ScanModalStyles } from '../components/ScanModal'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'
import * as lnurlTools from '@zerologin/lnurl'
import { useToast } from 'native-base'
import * as Clipboard from 'expo-clipboard'
import { GlobalSettingsContext } from '../contexts/Contexts'
// import { login } from '../services/LnurlService'

export default function Scan() {
    const toast = useToast()
    const [loggedIn, setLoggedIn] = useState<{ domain: string; pubKey: string } | null>(null)
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const accounts = await AccountService.getAccounts()
                if (accounts.length === 0) {
                    navigation.push('WelcomeCreateAccount')
                }
            } catch (e) {
                console.error(e)
            }
        }
        fetchAccounts()
    }, [])

    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [scanned, setScanned] = useState(false)
    const [lnurl, setLnurl] = useState<string | null>(null)
    const [lastLnurlScanned, setLastLnurlScanned] = useState<string | null>(null)

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === PermissionStatus.GRANTED)
        }

        getBarCodeScannerPermissions()
    }, [])

    /// Clipboard
    const globalSettingsContext = useContext(GlobalSettingsContext)
    const [fromClipboard, setFromClipboard] = useState(false)
    useEffect(() => {
        if (!globalSettingsContext.allowReadingClipboard) return

        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            const text = await Clipboard.getStringAsync()
            if (
                nextAppState === 'active' &&
                text !== lastLnurlScanned &&
                (text.toLowerCase().startsWith('lightning:lnurl1') ||
                    text.toLowerCase().startsWith('lnurl1'))
            ) {
                setFromClipboard(true)
                await handleBarCodeScanned({ data: text })
            }
        })

        return () => {
            subscription.remove()
        }
    }, [globalSettingsContext.allowReadingClipboard])
    const resetClipboard = async () => {
        if (fromClipboard) {
            await Clipboard.setStringAsync('')
            setFromClipboard(false)
        }
    }

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        try {
            const lnurl = lnurlTools.decode(data)
            if (lnurl.tag === 'login') {
                setScanned(true)
                setLnurl(data)
            }
        } catch (e) {
            if (lastLnurlScanned !== data) {
                toast.show({
                    backgroundColor: 'danger.500',
                    placement: 'top',
                    description: 'Invalid QR Code.',
                })
            }
        } finally {
            setLastLnurlScanned(data)
        }
    }

    const onRejected = async () => {
        setScanned(false)
        setLnurl(null)
        await resetClipboard()
    }
    const onLoggedin = (domain: string, pubKey: string) => {
        setLnurl(null)
        setLoggedIn({ domain, pubKey })
    }
    const onLoggedinOk = async () => {
        setScanned(false)
        setLoggedIn(null)
        await resetClipboard()
    }

    if (hasPermission === null) {
        return (
            <SafeAreaView>
                <Text>Requesting for camera permission</Text>
            </SafeAreaView>
        )
    }
    if (hasPermission === false) {
        return (
            <SafeAreaView>
                <Text>No access to camera, please allow camera in your phone settings</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
            />
            <View style={styles.menu}>
                <ScanModal>
                    {!loggedIn && !lnurl && (
                        <Text style={ScanModalStyles.text}>Scan a valid QR code to login</Text>
                    )}
                    {!loggedIn && lnurl && (
                        <LoginAction
                            lnurl={lnurl}
                            fromClipboard={fromClipboard}
                            onRejected={onRejected}
                            onLoggedin={onLoggedin}
                        />
                    )}
                    {loggedIn && (
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ ...ScanModalStyles.text, marginBottom: 5 }}>
                                Authenticated to <Text color='primary.400'>{loggedIn.domain}</Text>
                            </Text>
                            <Button onPress={onLoggedinOk}>Ok</Button>
                        </View>
                    )}
                    {/* <Button onPress={() => AccountService._debug_clearData()}>Erase data</Button>
                    <Button
                        onPress={() =>
                            login(
                                'lightning:LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7K2DPSXA3NZDEEVVUNYDR98QCRWWPKXEJKXDRPXEJKVCMXXGURVVF58QMRYEPCXV6X2DPJVCMX2VEKXCENWDFHVVCRZDTZVDNXVDE4XUN8GCT884KX7EMFDCC0JZVH'
                            )
                        }>
                        Login test
                    </Button> */}
                </ScanModal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        ...StyleSheet.absoluteFillObject,
    },
    menu: {
        width: '100%',
        position: 'absolute',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        bottom: 20,
        padding: 20,
    },
})
