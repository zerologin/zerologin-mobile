import React, { useContext, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
    Button,
    Center,
    Divider,
    FormControl,
    Input,
    Modal,
    Text,
    useToast,
    VStack,
} from 'native-base'
import { RouteParams } from '../../navigation/RootNavigator'
import { AccountContext } from '../../contexts/Contexts'
import AccountService, { IMnemonic } from '../../services/AccountService'
import { Platform } from 'react-native'

export default function AccountSettings() {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()
    const accountContext = useContext(AccountContext)
    const [account, setAccount] = useState<IMnemonic | null>(null)
    const toast = useToast()

    // Used for Android only
    const [label, setLabel] = React.useState('')
    const handleLabelChangeAndroid = (text: string) => setLabel(text)

    const loadAccount = async () => {
        const account = await AccountService.getCurrentAccount()
        if (!account) {
            console.error('No account in account settings. This should not happen.')
            return
        }
        setAccount(account)
    }

    useEffect(() => {
        loadAccount()
    }, [])

    const [showAndroidModal, setShowAndroidModal] = useState(false)

    const saveLabel = async (label: string | undefined) => {
        if (!label || label.length === 0) {
            toast.show({
                title: 'Label cannot be empty',
                backgroundColor: 'red.500',
            })
            return
        }

        await AccountService.setLabelById(accountContext.id, label)
        await loadAccount()
        toast.show({
            title: 'Label changed',
        })
    }

    const showChangeLabelDialog = () => {
        if (Platform.OS === 'ios') {
            Alert.prompt(
                'Enter new label',
                '',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: async (label) => {
                            await saveLabel(label)
                        },
                    },
                ],
                'plain-text'
            )
        } else if (Platform.OS === 'android') {
            setShowAndroidModal(true)
        } else {
            console.error('Unsupported platform')
        }
    }

    const showDeleteConfirmDialog = () => {
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
            <Text>Current label: {account?.label ?? account?.id}</Text>
            <Button onPress={showChangeLabelDialog}>Change label</Button>

            {Platform.OS === 'android' && (
                <Center>
                    <Modal isOpen={showAndroidModal} onClose={() => setShowAndroidModal(false)}>
                        <Modal.Content>
                            <Modal.CloseButton />
                            <Modal.Header>Enter new label</Modal.Header>
                            <Modal.Body>
                                <FormControl>
                                    <FormControl.Label>Label</FormControl.Label>
                                    <Input value={label} onChangeText={handleLabelChangeAndroid} />
                                </FormControl>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Group space={2}>
                                    <Button
                                        variant='ghost'
                                        colorScheme='blueGray'
                                        onPress={() => {
                                            setShowAndroidModal(false)
                                        }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onPress={async () => {
                                            await saveLabel(label)
                                            setShowAndroidModal(false)
                                        }}>
                                        Ok
                                    </Button>
                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </Center>
            )}

            <Divider my='2' />

            <Text>Mnemonic type: BIP39</Text>
            <Button onPress={() => navigation.navigate('ViewMnemonic')}>View mnemonic</Button>

            <Divider my='2' />

            <Button colorScheme='danger' onPress={showDeleteConfirmDialog}>
                Delete account
            </Button>
        </VStack>
    )
}
