import * as bip39 from 'bip39'

export const bytesToHexString = (bytes: Uint8Array) => {
    return bytes.reduce(function (memo, i) {
        return memo + ('0' + i.toString(16)).slice(-2) //padd with leading 0 if <16
    }, '')
}

export const stringToUint8Array = (str: string) => {
    return Uint8Array.from(str, (x) => x.charCodeAt(0))
}

export const hexToUint8Array = (hexString: string) => {
    return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
}

export const seedFromWords = async (mnemonic: string) => {
    const seed = await bip39.mnemonicToSeed(mnemonic)
    return Buffer.from(seed)
}