import api from "./api";

export default class InstructorsApi {
  getInstructors(headers) {
    return api.get("/instructors", headers);
  }

  getCategories(headers) {
    return api.get("/instructors/categories", headers);
  }

  getInstructorsByName(instructorName, headers){
    return api.get(`/instructors/${instructorName}`, headers);
  }

  updateTestViewsById(testId, headers){
    return api.put(`/instructors/tests/${testId}`, {}, headers);
  }

  getDisciplines(headers){
    return api.get("/instructors/disciplines", headers);
  }

  getInstructorsByDiscipline(disciplineId, headers){
    return api.get(`/instructors/disciplines/${disciplineId}`, headers);
  }

  createTestByInstructor(testData, headers){
    return api.post('/instructors/tests/create', testData, headers);
  }
}