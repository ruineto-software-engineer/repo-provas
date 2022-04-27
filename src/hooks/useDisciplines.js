import { useContext } from "react";
import DisciplinesContext from "../contexts/DisciplinesContext";

export default function useDisciplines() {
  return useContext(DisciplinesContext);
}