import { createContext, useContext } from 'react';
import { useActiveIdentity } from '../mocks/reviewStore';

const IdentityContext = createContext(null);

export function IdentityProvider({ children }) {
  const value = useActiveIdentity();
  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error('useIdentity must be used inside IdentityProvider');
  return ctx;
}
