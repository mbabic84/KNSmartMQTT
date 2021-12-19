import React, { createContext } from 'react';

export const Context = createContext();

export default function ({ children }) {
    return <Context.Provider value={{}}>{children}</Context.Provider>;
}