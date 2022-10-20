import * as SecureStore from 'expo-secure-store';
import { KEY_PREFIX } from '../utils/constants';

async function setAsync(key: string, value: string) {
    await SecureStore.setItemAsync(KEY_PREFIX + key, value);
}

async function getAsync(key: string) {
    let result = await SecureStore.getItemAsync(KEY_PREFIX + key);
    if (result) {
        return result.startsWith('[') || result.startsWith('{') ? JSON.parse(result) : result
    } else {
        return null
    }
}

export default { setAsync, getAsync }