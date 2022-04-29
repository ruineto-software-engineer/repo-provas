import { useContext } from "react";
import InstructorsInputValueContext from "../contexts/InstructorsInputValueContext";

export default function useInstructors() {
  return useContext(InstructorsInputValueContext);
}