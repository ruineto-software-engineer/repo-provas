import { useContext } from "react";
import TermsInputValueContext from "../contexts/TermsInputValueContext";

export default function useInstructors() {
  return useContext(TermsInputValueContext);
}