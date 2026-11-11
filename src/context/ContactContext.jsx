import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { NOT_SURE, packages } from '../data/pricing';
import { scrollToId } from '../lib/utils';

// Shared state so any "Get Started" button (pricing cards, footer links) can pre-select a
// package and purpose in the contact form, then scroll to it.
const ContactContext = createContext({
  selection: { packageName: null, purpose: null, nonce: 0 },
  choosePackage: () => {},
});

export function ContactProvider({ children }) {
  const [selection, setSelection] = useState({ packageName: null, purpose: null, nonce: 0 });

  const choosePackage = useCallback((packageId) => {
    const pkg = packages.find((p) => p.id === packageId);
    // nonce changes every call so picking the same package twice still re-applies it.
    if (pkg) {
      setSelection((s) => ({ packageName: pkg.name, purpose: pkg.purpose, nonce: s.nonce + 1 }));
    } else if (packageId === 'not-sure') {
      setSelection((s) => ({ packageName: NOT_SURE, purpose: 'General Fitness Guidance', nonce: s.nonce + 1 }));
    }
    scrollToId('contact');
  }, []);

  const value = useMemo(() => ({ selection, choosePackage }), [selection, choosePackage]);
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export const useContact = () => useContext(ContactContext);
