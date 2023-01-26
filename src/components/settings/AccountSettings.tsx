import React, { useContext } from 'react'
import { Text, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, VStack } from 'native-base'
import { RouteParams } from '../../navigation/RootNavigator'
import { AccountContext } from '../../contexts/Contexts'
import AccountService from '../../services/AccountService'

export default function AccountSettings() {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()
    const accountContext = useContext(AccountContext)

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
        const accounts = await AccountService.getAccounts()
        if (accounts.length > 0) {
            await accountContext.setCurrentAccount(accounts[0].id)
            navigation.navigate('Scan')
        } else {
            navigation.popToTop()
            navigation.replace('WelcomeCreateAccount')
        }
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
