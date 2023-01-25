import React from 'react'
import { Text, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'
import { Button, VStack } from 'native-base'

export default function AccountSettings() {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    const showConfirmDialog = () => {
        return Alert.alert(
            'Delete account',
            'Deleting this account results in the loss of all services accounts created with it. Are you sure you want to delete this account?',
            [
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await delectAccount()
                    },
                },
                {
                    text: 'Cancel',
                },
            ]
        )
    }

    async function delectAccount() {
        const account = await AccountService.getCurrentAccount()
        if (!account) {
            console.error('No account to delete in account settings. This should not happen.')
            return
        }
        await AccountService.deleteAccount(account.id)
        navigation.push('Scan')
    }

    return (
        <VStack space={4} margin={4}>
            <Text>Mnemonic type: BIP39</Text>
            <Button onPress={() => navigation.navigate('ViewMnemonic')}>View mnemonic</Button>
            <Button colorScheme='danger' onPress={showConfirmDialog}>
                Delete account
            </Button>
        </VStack>
    )
}
