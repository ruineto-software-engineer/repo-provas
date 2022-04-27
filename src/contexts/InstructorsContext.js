import { createContext, useState } from "react";

const InstructorsContext = createContext();

export function InstructorsProvider({ children }) {
  const [instructors, setInstructors] = useState(null);

  return (
    <InstructorsContext.Provider value={{ instructors, setInstructors }}>
      {children}
    </InstructorsContext.Provider>
  )
}

export default InstructorsContext;