import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner'
import { Button, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { AppState, Linking, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoginAction from '../components/LoginAction'
import ScanModal, { styles as ScanModalStyles } from '../components/ScanModal'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'
import * as lnurlTools from '@zerologin/lnurl'
import { useToast } from 'native-base'
import * as Clipboard from 'expo-clipboard'
import { FontAwesome5 } from '@expo/vector-icons'
// import { login } from '../services/LnurlService'

export default function Scan() {
    const toast = useToast()
    const [loggedIn, setLoggedIn] = useState<{ domain: string; pubKey: string } | null>(null)
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    // Camera permissions
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

    // Setup enable/disable camera on Screen focus and AppState change
    const [isScreenFocused, setIsScreenFocused] = useState(true)
    useFocusEffect(
        React.useCallback(() => {
            setIsScreenFocused(true)

            return () => {
                setIsScreenFocused(false)
            }
        }, [])
    )
    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (nextAppState === 'active' && isScreenFocused) {
                setIsScreenFocused(true)
            } else {
                setIsScreenFocused(false)
            }
        })

        return () => {
            subscription.remove()
        }
    }, [])

    // Setup account
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

    /// Clipboard
    const [fromClipboard, setFromClipboard] = useState(false)
    const onClipboardButton = async () => {
        const text = await Clipboard.getStringAsync()
        if (
            !text.toLowerCase().startsWith('lightning:lnurl1') &&
            !text.toLowerCase().startsWith('lnurl1') &&
            !text.toLowerCase().startsWith('keyauth://')
        ) {
            toast.show({
                backgroundColor: 'danger.500',
                placement: 'top',
                description: 'Invalid QR Code.',
            })
            return
        }

        if (text !== lastLnurlScanned) {
            setFromClipboard(true)
            await handleBarCodeScanned({ data: text })
        }
    }

    // Init Linking events (opening Zerologin from another app using keyauth:// scheme)
    useEffect(() => {
        const subscription = Linking.addEventListener('url', async (data) => {
            navigation.navigate('Scan')
            await handleBarCodeScanned({ data: data.url })
        })

        return () => {
            subscription.remove()
        }
    }, [])

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
        setFromClipboard(false)
        setLastLnurlScanned(null)
    }
    const onLoggedin = (domain: string, pubKey: string) => {
        setLnurl(null)
        setLoggedIn({ domain, pubKey })

        // Auto dismiss modal after 10 seconds
        setTimeout(async () => {
            await onLoggedinOkButton()
        }, 10000)
    }
    const onLoggedinOkButton = async () => {
        setScanned(false)
        setLoggedIn(null)
        setFromClipboard(false)
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
            {isScreenFocused && (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.camera}
                />
            )}
            <View style={styles.menu}>
                <ScanModal>
                    {!loggedIn && !lnurl && (
                        <>
                            <Text style={ScanModalStyles.text}>Scan a valid QR code to login</Text>
                        </>
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
                            <Button onPress={onLoggedinOkButton}>Ok</Button>
                        </View>
                    )}

                    {!loggedIn && !lnurl && (
                        <Button
                            style={{ marginTop: 10 }}
                            onPress={onClipboardButton}
                            variant='ghost'
                            colorScheme='secondary'
                            leftIcon={<FontAwesome5 name='paste' size={16} color='white' />}>
                            paste from clipboard
                        </Button>
                    )}

                    {/* <Button onPress={() => AccountService._debug_clearData()}>Erase data</Button> */}
                    {/* <Button
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
