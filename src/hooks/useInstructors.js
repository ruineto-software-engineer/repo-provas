import { useContext } from "react";
import InstructorsContext from "../contexts/InstructorsContext";

export default function useInstructors() {
  return useContext(InstructorsContext);
}