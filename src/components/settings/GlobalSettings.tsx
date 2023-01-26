import React, { useEffect } from 'react'
import { Text } from 'react-native'
import { HStack, Switch, VStack } from 'native-base'
import { GlobalSettingsContext } from '../../contexts/Contexts'

export default function GlobalSettings() {
    const [allowClipboard, setAllowClipboard] = React.useState(false)
    const settingsContext = React.useContext(GlobalSettingsContext)

    useEffect(() => {
        async function initSettings() {
            setAllowClipboard(settingsContext.allowReadingClipboard)
        }
        initSettings()
    }, [])

    return (
        <VStack space={4} margin={4}>
            <HStack alignItems='center' justifyContent='space-between'>
                <Text>Allow reading clipboard {allowClipboard}</Text>
                <Switch
                    value={allowClipboard}
                    onToggle={async (e) => {
                        await settingsContext.setAllowReadingClipboard(e)
                        setAllowClipboard(e)
                    }}
                />
            </HStack>
        </VStack>
    )
}
