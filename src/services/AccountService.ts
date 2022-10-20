import { CryptoDigestAlgorithm, CryptoEncoding, digestStringAsync } from "expo-crypto";
import { seedFromWords } from "../utils/Utils";
import SecureStoreService from "./SecureStoreService";
import StorageService from "./StorageService";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CURRENT_ACCOUNT = 'CURRENT_ACCOUNT'
const ACCOUNTS = 'ACCOUNTS'

async function setCurrentAccount(id: string) {
    await StorageService.setAsync(CURRENT_ACCOUNT, id)
}

async function getCurrentAccount(): Promise<IMnemonic | null> {
    const id = await StorageService.getAsync(CURRENT_ACCOUNT)

    if (id === null) {
        console.log(`No account set`)
        return null
    }

    const account = await getAccount(id)
    if (account === null) {
        console.log(`No account found for id ${id}`)
        return null
    }

    const secrets: ISecret | null = await SecureStoreService.getAsync(account.id)
    if (secrets === null) {
        console.log(`No mnemonic found for id ${id}`)
        return null
    }

    return { ...account, secrets: { mnemonic: secrets.mnemonic, seed: secrets.seed } }
}


async function getAccounts(): Promise<IMnemonic[]> {
    const accounts = await StorageService.getAsync(ACCOUNTS)
    return accounts ?? []
}

async function addAccount(mnemonic: string): Promise<string> {
    const accounts = await getAccounts()
    const id = await digestStringAsync(CryptoDigestAlgorithm.SHA256, mnemonic, {
        encoding: CryptoEncoding.HEX,
    })

    accounts.push({ id, createdAt: new Date(), secrets: null })
    await StorageService.setAsync(ACCOUNTS, JSON.stringify(accounts))

    const seed = await seedFromWords(mnemonic)

    await SecureStoreService.setAsync(id, JSON.stringify({ mnemonic, seed: seed.toString('hex') }))

    return id
}

async function getAccount(id: string): Promise<IMnemonic | null> {
    const accounts = await getAccounts()
    const account = accounts.find(a => a.id === id)
    return account ?? null
}

async function _debug_clearData() {
    await AsyncStorage.clear()
    const accounts = await getAccounts()
    for (const account of accounts) {
        await SecureStore.deleteItemAsync(account.id)
    }
}

export interface IMnemonic {
    id: string
    secrets: ISecret | null
    createdAt: Date
}
export interface ISecret {
    mnemonic: string
    seed: string
}
export default { setCurrentAccount, getCurrentAccount, addAccount, getAccount, getAccounts, _debug_clearData }