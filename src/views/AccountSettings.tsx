import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import Button, { ButtonType } from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'
import AccountService from '../services/AccountService'

export default function AccountSettings() {
    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
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
                        setShowConfirmDelete(false)
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

    async function handleviewMnemonic() {
        const account = await AccountService.getCurrentAccount()
        if (!account) {
            console.error(
                'No account to view mnemonic in account settings. This should not happen.'
            )
            return
        }
        if (!account.secrets) {
            console.error(
                'No account secrets to view mnemonic in account settings. This should not happen.'
            )
            return
        }
        navigation.navigate('ViewMnemonic', { mnemonic: account.secrets.mnemonic })
    }

    return (
        <View style={styles.container}>
            <Text>Mnemonic type: BIP39</Text>
            <Button text='View mnemonic' type={ButtonType.primary} onPress={handleviewMnemonic} />
            <Button text='Delete account' type={ButtonType.secondary} onPress={showConfirmDialog} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
})
