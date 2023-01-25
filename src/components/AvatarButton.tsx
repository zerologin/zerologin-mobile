import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useContext } from 'react'
import { Pressable } from 'react-native'
import { AccountContext } from '../contexts/Contexts'
import { RouteParams } from '../navigation/RootNavigator'
import Avatar from './Avatar'

export default function AvatarButton() {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()
    const currentAccount = useContext(AccountContext)
    return (
        <Pressable onPress={() => navigation.navigate('Accounts')}>
            <Avatar size={32} identifier={currentAccount.id}></Avatar>
        </Pressable>
    )
}
