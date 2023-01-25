import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from 'native-base'
import { Pressable } from 'react-native'
import { RouteParams } from '../navigation/RootNavigator'

export default function AddAccountButton() {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    return (
        <Pressable onPress={() => navigation.navigate('CreateAccount')}>
            <Text fontSize='md'>Add</Text>
        </Pressable>
    )
}
