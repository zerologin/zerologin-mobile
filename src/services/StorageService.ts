import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEY_PREFIX } from '../utils/constants';


async function setAsync(key: string, value: string) {
    await AsyncStorage.setItem(KEY_PREFIX + key, value);
}

async function getAsync(key: string) {
    let result = await AsyncStorage.getItem(KEY_PREFIX + key);
    if (result) {
        return result.startsWith('[') || result.startsWith('{') ? JSON.parse(result) : result
    } else {
        return null
    }
}

export default { setAsync, getAsync }