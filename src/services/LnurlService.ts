import { HMAC as sha256HMAC } from 'fast-sha256'
import secp256k1 from 'secp256k1'
import * as lnurl from '@zerologin/lnurl'
import { bytesToHexString, hexToUint8Array, stringToUint8Array } from '../utils/Utils'
import AccountService from './AccountService'
import { bip32 } from '../utils/bip32'
import { BIP32Interface } from 'bip32';

export const login = async (lnurlString: string): Promise<{ domain: string, pubKey: string }> => {
    return new Promise(async (resolve, reject) => {
        try {
            const lnurlObject = lnurl.decode(lnurlString)
            const lnurlDecoded = lnurlObject.decoded
            const k1 = lnurlObject.k1
            const domain = lnurlObject.domain

            const account = await AccountService.getCurrentAccount()
            if (account === null || account.secrets === null) {
                console.log('No current account set')
                return null
            }
            const root = bip32.fromSeed(Buffer.from(account.secrets.seed, 'hex'))

            const hashingKey = root.derivePath(`m/138'/0`)
            const hashingPrivKey = hashingKey.privateKey

            if (!hashingPrivKey) throw new Error('Cannot derive pub key')
            const derivationMaterial = new sha256HMAC(hashingPrivKey).update(stringToUint8Array(domain)).digest()

            const pathSuffix = new Uint32Array(derivationMaterial.buffer.slice(0, 16))
            const path = `m/138'/${pathSuffix.join('/')}`

            const linkingKey = root.derivePath(path)

            if (!linkingKey.privateKey) throw new Error("Cannot derive pub key")
            const linkingKeyPub = secp256k1.publicKeyCreate(linkingKey.privateKey, true)

            const signedMessage = secp256k1.ecdsaSign(hexToUint8Array(k1), linkingKey.privateKey)
            const signedMessageDER = secp256k1.signatureExport(signedMessage.signature)

            const url =
                lnurlDecoded +
                `&sig=${bytesToHexString(signedMessageDER)}` +
                `&key=${bytesToHexString(linkingKeyPub)}`

            const result = await fetch(url)
            let response
            try {
                response = await result.json()
            } catch (error) {
                reject(error)
            }
            resolve({ domain, pubKey: Buffer.from(linkingKeyPub).toString('hex') })
        } catch (error) {
            console.log('Error while login', error)
            reject(error)
        }
    })
}