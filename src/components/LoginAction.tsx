import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import Button, { ButtonType } from './Button'
import { login } from '../services/LnurlService'
import { useState } from 'react'
import * as lnurl from '@zerologin/lnurl'

interface LoginActionProps {
    lnurl: string
    onLoggedin: (url: string, pubKey: string) => void
    onRejected: () => void
}

export default function LoginAction(props: LoginActionProps) {
    const [connecting, setConnecting] = useState(false)

    const url = lnurl.decode(props.lnurl)

    async function handleLoginPress() {
        setConnecting(true)
        try {
            const { domain, pubKey } = await login(props.lnurl)
            props.onLoggedin(domain, pubKey)
        } catch (error) {
            throw error
        } finally {
            setConnecting(false)
        }
    }

    return (
        <>
            <Text style={style.message}>Login request for {url.domain}</Text>
            {!connecting && (
                <View style={style.buttons}>
                    <Button text='Reject' type={ButtonType.secondary} onPress={props.onRejected} />
                    <Button text='Login' type={ButtonType.primary} onPress={handleLoginPress} />
                </View>
            )}
            {connecting && <ActivityIndicator size='large' color='blue' animating={connecting} />}
        </>
    )
}

const style = StyleSheet.create({
    message: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
})
