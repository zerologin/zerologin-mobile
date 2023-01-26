import * as bip39 from 'bip39'
import React, { useContext, useState } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'
import DisplayMnemonic from '../components/DisplayMnemonic'
import { Box, Button, Text, useToast, VStack } from 'native-base'
import { AccountContext } from '../contexts/Contexts'

export default function CreateAccount() {
    const toast = useToast()
    const [generateAction, setGenerateAction] = useState(false)
    const [importAction, setImportAction] = useState(false)
    const [mnemonic, setMnemonic] = useState('')
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()
    const accountContext = useContext(AccountContext)

    const handleGenerateButtonClick = async () => {
        const mnemonic = bip39.generateMnemonic()

        if (await AccountService.accountAlreadyExists(mnemonic)) {
            toast.show({
                title: 'Account already exists',
                backgroundColor: 'danger.500',
            })
            return
        }

        const id = await AccountService.addAccount(mnemonic)
        accountContext.setCurrentAccount(id)
        setMnemonic(mnemonic)
        setGenerateAction(true)
    }

    const handleImportButtonClick = async () => {
        if (!bip39.validateMnemonic(mnemonic)) {
            toast.show({
                title: 'Invalid mnemonic',
                backgroundColor: 'danger.500',
            })
            return
        }

        if (await AccountService.accountAlreadyExists(mnemonic)) {
            toast.show({
                title: 'Account already exists',
                backgroundColor: 'danger.500',
            })
            return
        }

        const id = await AccountService.addAccount(mnemonic)
        accountContext.setCurrentAccount(id)
        navigation.popToTop()
    }

    const handleImportInput = (text: string) => {
        setMnemonic(text)
    }

    if (generateAction) {
        return (
            <View style={{ ...styles.container }}>
                <DisplayMnemonic mnemonic={mnemonic}></DisplayMnemonic>
            </View>
        )
    }

    if (importAction) {
        return (
            <VStack style={styles.container} space={2} padding={4}>
                <TextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={(text) => handleImportInput(text)}
                    value={mnemonic}
                    style={{
                        width: '100%',
                        padding: 10,
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                    editable
                />
                <Button onPress={handleImportButtonClick}>Import</Button>
            </VStack>
        )
    }

    return (
        <VStack style={styles.container} space={2}>
            <Box m={6}>
                <Text fontSize='xl'>Generate or import your mnemonic.</Text>
                <Text fontSize='xl'>KEEPT IT SAFE.</Text>
                <Text fontSize='xl'>NEVER SHARE IT.</Text>
            </Box>
            <VStack style={styles.container} space={2}>
                <Button onPress={handleGenerateButtonClick}>Generate</Button>
                <Text>or</Text>
                <Button variant='outline' onPress={() => setImportAction(true)}>
                    Import
                </Button>
            </VStack>
        </VStack>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
