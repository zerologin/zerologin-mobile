import { createContext } from "react";

interface IAccountContext {
    id: string,
    setCurrentAccount: (id: string) => Promise<void>
}
export const AccountContext = createContext<IAccountContext>({
    id: '',
    setCurrentAccount: async () => { }
});
