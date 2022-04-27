import { createContext, useState } from "react";

const DisciplinesContext = createContext();

export function DisciplinesProvider({ children }) {
  const [disciplines, setDisciplines] = useState(null);

  return (
    <DisciplinesContext.Provider value={{ disciplines, setDisciplines }}>
      {children}
    </DisciplinesContext.Provider>
  )
}

export default DisciplinesContext;