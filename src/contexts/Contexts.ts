import { createContext } from "react";

interface IAccountContext {
    id: string,
    setCurrentAccount: (id: string) => Promise<void>
}
export const AccountContext = createContext<IAccountContext>({
    id: '',
    setCurrentAccount: async () => { }
});


interface IGlobalSettingsContext {
    allowReadingClipboard: boolean,
    setAllowReadingClipboard: (value: boolean) => Promise<void>
}
export const GlobalSettingsContext = createContext<IGlobalSettingsContext>({
    allowReadingClipboard: false,
    setAllowReadingClipboard: async () => { }
});
