import StorageService from "./StorageService";


const ALLOW_READING_CLIPBOARD = 'ALLOW_READING_CLIPBOARD'
async function setAllowReadingClipboard(value: boolean) {
    await StorageService.setAsync(ALLOW_READING_CLIPBOARD, value.toString())
}
async function getAllowReadingClipboard(): Promise<boolean> {
    const value = await StorageService.getAsync(ALLOW_READING_CLIPBOARD)
    if (value === null) return false
    return value === 'true'
}

export default { setAllowReadingClipboard, getAllowReadingClipboard }
