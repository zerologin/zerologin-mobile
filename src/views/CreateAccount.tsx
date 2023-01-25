import * as bip39 from 'bip39'
import React, { useContext, useState } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'
import DisplayMnemonic from '../components/DisplayMnemonic'
import { Box, Button, Text, VStack } from 'native-base'
import { AccountContext } from '../contexts/Contexts'

export default function CreateAccount() {
    const [generate, setGenerate] = useState(false)
    const [importMn, setImportMn] = useState(false)
    const [isMnemonicValid, setIsMnemonicValid] = useState(true)
    const [mnemonic, setMnemonic] = useState('')
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()
    const accountContext = useContext(AccountContext)

    const handleGenerateButtonClick = async () => {
        const mnemonic = bip39.generateMnemonic()
        const id = await AccountService.addAccount(mnemonic)
        accountContext.setCurrentAccount(id)
        setMnemonic(mnemonic)
        setGenerate(true)
    }

    const handleImportButtonClick = async () => {
        setImportMn(true)

        if (!bip39.validateMnemonic(mnemonic)) {
            setIsMnemonicValid(false)
            return
        }
        const id = await AccountService.addAccount(mnemonic)
        accountContext.setCurrentAccount(id)
        navigation.popToTop()
    }

    const handleImportInput = (text: string) => {
        setIsMnemonicValid(true)
        setMnemonic(text)
    }

    if (generate) {
        return (
            <View style={{ ...styles.container }}>
                <DisplayMnemonic mnemonic={mnemonic}></DisplayMnemonic>
            </View>
        )
    }

    if (importMn) {
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
                {!isMnemonicValid && <Text>Invalid Mnemonic</Text>}
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
                <Button variant='outline' onPress={handleImportButtonClick}>
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
