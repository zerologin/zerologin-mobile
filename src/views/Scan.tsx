import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button, { ButtonType } from '../components/Button'
import LoginAction from '../components/LoginAction'
import ScanModal, { styles as ScanModalStyles } from '../components/ScanModal'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'

export default function Scan() {
    const [loggedIn, setLoggedIn] = useState<{ domain: string; pubKey: string } | null>(null)
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const accounts = await AccountService.getAccounts()
                if (accounts.length === 0) {
                    navigation.navigate('CreateAccount')
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
                        <Text style={ScanModalStyles.text}>Please scan a valid QR code</Text>
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
                                Authenticated to {loggedIn.domain}{' '}
                            </Text>
                            <Button
                                text='Ok'
                                type={ButtonType.primary}
                                onPress={onLoggedinOk}></Button>
                        </View>
                    )}
                    {/* <Button
                        text='Erase data'
                        type={ButtonType.primary}
                        onPress={() => AccountService._debug_clearData()}
                    />
                    <Button
                        text='Login test'
                        type={ButtonType.primary}
                        onPress={() =>
                            login(
                                'lightning:LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7K2ET9VV6KYDNRX5CX2DFKV3NXGVP3XGCNJDFKX43R2DN98YMRZWRR8YEKZWRP8YURGVRYVCERJDN9XF3RQDMYXFNRVV34V4SKGCTRXSN8GCT884KX7EMFDC8LNMFN'
                            )
                        }
                    /> */}
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
