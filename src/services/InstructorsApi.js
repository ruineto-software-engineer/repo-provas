import api from "./api";

export default class InstructorsApi {
  getInstructors(headers) {
    return api.get("/instructors/disciplines", headers);
  }

  getCategories(headers) {
    return api.get("/instructors/categories", headers);
  }
}