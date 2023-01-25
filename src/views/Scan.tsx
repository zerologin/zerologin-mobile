import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner'
import { Button, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoginAction from '../components/LoginAction'
import ScanModal, { styles as ScanModalStyles } from '../components/ScanModal'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'
// import { login } from '../services/LnurlService'

export default function Scan() {
    const [loggedIn, setLoggedIn] = useState<{ domain: string; pubKey: string } | null>(null)
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const accounts = await AccountService.getAccounts()
                if (accounts.length === 0) {
                    navigation.push('CreateAccount')
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

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === PermissionStatus.GRANTED)
        }

        getBarCodeScannerPermissions()
    }, [])

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        setScanned(true)
        setLnurl(data)
    }

    const onRejected = () => {
        setScanned(false)
        setLnurl(null)
    }
    const onLoggedin = (domain: string, pubKey: string) => {
        setLnurl(null)
        setLoggedIn({ domain, pubKey })
    }
    const onLoggedinOk = () => {
        setScanned(false)
        setLoggedIn(null)
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
