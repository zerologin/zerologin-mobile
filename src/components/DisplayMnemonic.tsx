import React from 'react'
import { View, Text } from 'react-native'
import Button, { ButtonType } from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'

export default function DisplayMnemonic(props: { mnemonic: string }) {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    return (
        <View
            style={{
                flex: 1,
                margin: 20,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
            {props.mnemonic.split(' ').map((w, i) => (
                <Text key={i} style={{ marginRight: 25, marginBottom: 25, fontSize: 16 }}>
                    <Text style={{ color: '#6b6b6b' }}>#{i + 1}</Text> {w}
                </Text>
            ))}
            <Button
                text='I wrote it down'
                type={ButtonType.primary}
                onPress={() => navigation.goBack()}></Button>
        </View>
    )
}
