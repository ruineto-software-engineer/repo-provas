import { createContext, useState } from "react";

const InstructorsInputValueContext = createContext();

export function InstructorsInputValueProvider({ children }) {
  const [instructorsInputValue, setInstructorsInputValue] = useState('');

  return (
    <InstructorsInputValueContext.Provider value={{ instructorsInputValue, setInstructorsInputValue }}>
      {children}
    </InstructorsInputValueContext.Provider>
  )
}

export default InstructorsInputValueContext;