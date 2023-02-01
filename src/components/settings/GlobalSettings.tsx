import React from 'react'
import { Text } from 'react-native'
import { HStack, VStack } from 'native-base'

export default function GlobalSettings() {
    return (
        <VStack space={4} margin={4}>
            <HStack alignItems='center' justifyContent='space-between'>
                <Text>Nothing to see here for now</Text>
            </HStack>
        </VStack>
    )
}
