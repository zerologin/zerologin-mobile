import React, { useContext, useEffect } from 'react'
import { Box, FlatList, Heading, HStack, Pressable, Spacer, Text, VStack } from 'native-base'
import AccountService, { IMnemonic } from '../services/AccountService'
import Avatar from '../components/Avatar'
import dayjs from 'dayjs'
import { AccountContext } from '../contexts/Contexts'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'

const handleSetCurrentAccount = async (id: string) => {
    await AccountService.setCurrentAccount(id)
}

export default function Accounts() {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()
    const currentAccountContext = useContext(AccountContext)
    const [accounts, setAccounts] = React.useState<IMnemonic[]>([])
    // const [currentAccount, setCurrentAccount] = React.useState<string>('')

    useEffect(() => {
        const getAccounts = async () => {
            const accounts = await AccountService.getAccounts()
            setAccounts(accounts)
        }
        getAccounts()
    }, [])

    return (
        <Box>
            <FlatList
                p='4'
                data={accounts}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => currentAccountContext.setCurrentAccount(item.id)}
                        onLongPress={() => {
                            currentAccountContext.setCurrentAccount(item.id)
                            navigation.navigate('AccountSettings')
                        }}>
                        <Box
                            borderBottomWidth='1'
                            _dark={{
                                borderColor: 'muted.50',
                            }}
                            borderColor='muted.800'
                            pl={['0', '4']}
                            pr={['0', '5']}
                            py='2'>
                            <HStack space={[2, 3]} justifyContent='space-between'>
                                <Avatar size={48} identifier={item.id} />
                                <VStack>
                                    <Text
                                        _dark={{
                                            color: 'warmGray.50',
                                        }}
                                        color='coolGray.800'
                                        bold>
                                        {item.id.substring(0, 8)}
                                    </Text>
                                    <Text
                                        color='coolGray.600'
                                        _dark={{
                                            color: 'warmGray.200',
                                        }}>
                                        Created {dayjs(item.createdAt).format('DD/MM/YYYY')}
                                    </Text>
                                </VStack>
                                <Spacer />
                                {currentAccountContext.id === item.id && (
                                    <Text fontSize='xs' color='success.800' alignSelf='center'>
                                        SELECTED
                                    </Text>
                                )}
                            </HStack>
                        </Box>
                    </Pressable>
                )}
                keyExtractor={(item) => item.id}
            />
        </Box>
    )
}
