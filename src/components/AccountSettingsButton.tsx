import { Pressable, View, Text, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'

export default function AccountSettingsButton() {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    return (
        <Pressable onPress={() => navigation.navigate('AccountSettings')}>
            <Ionicons name='ios-settings' size={32} color='#fff' />
        </Pressable>
    )
}
