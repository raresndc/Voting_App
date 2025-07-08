import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({
  user: null,
  setUser: () => {},
  clearUser: () => {}
});

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const setUser = userData => setUserState(userData);
  const clearUser = () => setUserState(null);
  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}