import { createContext } from "react";

export const AccountContext = createContext<{ id: string, setCurrentAccount: (id: string) => void }>({ id: "", setCurrentAccount: () => { } });
