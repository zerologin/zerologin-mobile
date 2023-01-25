import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import AccountService from '../services/AccountService'
import DisplayMnemonic from '../components/DisplayMnemonic'
import { AccountContext } from '../contexts/Contexts'

export default function ViewMnemonic() {
    const accountContext = useContext(AccountContext)
    const [mnemonic, setMnemonic] = useState('')

    useEffect(() => {
        async function fetchMnemonic() {
            try {
                const account = await AccountService.getAccount(accountContext.id, true)
                if (account?.secrets?.mnemonic) {
                    setMnemonic(account.secrets.mnemonic)
                }
            } catch (e) {
                console.error(e)
            }
        }
        fetchMnemonic()
    }, [])

    return (
        <View>
            <DisplayMnemonic mnemonic={mnemonic}></DisplayMnemonic>
        </View>
    )
}
