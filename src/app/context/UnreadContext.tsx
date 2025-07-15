// context/UnreadContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';

type UnreadMap = Record<string, boolean>;

const UnreadContext = createContext<{
  unreadByPhone: UnreadMap;
  setUnreadByPhone: React.Dispatch<React.SetStateAction<UnreadMap>>;
}>({
  unreadByPhone: {},
  setUnreadByPhone: () => {},
});

export const UnreadProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadByPhone, setUnreadByPhone] = useState<UnreadMap>({});
  return (
    <UnreadContext.Provider value={{ unreadByPhone, setUnreadByPhone }}>
      {children}
    </UnreadContext.Provider>
  );
};

export const useUnread = () => useContext(UnreadContext);
