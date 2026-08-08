"use client";

import { createContext, useContext } from "react";

const RoleContext = createContext({
  role: null,
  user: null,
});

export function RoleProvider({ role, user, children }) {
  return (
    <RoleContext.Provider value={{ role, user }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  return context;
}
