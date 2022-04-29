import { createContext, useState } from "react";

const TermsInputValueContext = createContext();

export function TermsInputValueProvider({ children }) {
  const [termsInputValue, setTermsInputValue] = useState('');

  return (
    <TermsInputValueContext.Provider value={{ termsInputValue, setTermsInputValue }}>
      {children}
    </TermsInputValueContext.Provider>
  )
}

export default TermsInputValueContext;