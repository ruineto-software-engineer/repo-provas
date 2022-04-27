import api from "./api";

export default class CoursesApi {
  getDisciplines(headers) {
    return api.get("/disciplines", headers);
  }

  getDisciplinesByName(displineName, headers) {
    return api.get(`/disciplines/${displineName}`, headers);
  }
}