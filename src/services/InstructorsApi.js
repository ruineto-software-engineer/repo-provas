import api from "./api";

export default class InstructorsApi {
  getInstructors(headers) {
    return api.get("/instructors", headers);
  }
}