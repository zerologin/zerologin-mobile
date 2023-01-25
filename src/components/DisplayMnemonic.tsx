import React from 'react'
import { Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteParams } from '../navigation/RootNavigator'
import { Box, Button, Flex } from 'native-base'

export default function DisplayMnemonic(props: { mnemonic: string }) {
    const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>()

    return (
        <Box margin={4}>
            <Flex direction='row' wrap='wrap' justifyContent='center'>
                {props.mnemonic.split(' ').map((w, i) => (
                    <Text key={i} style={{ marginRight: 25, marginBottom: 25, fontSize: 16 }}>
                        <Text style={{ color: '#6b6b6b' }}>#{i + 1}</Text> {w}
                    </Text>
                ))}
            </Flex>
            <Button onPress={() => navigation.goBack()}>I wrote it down</Button>
        </Box>
    )
}
