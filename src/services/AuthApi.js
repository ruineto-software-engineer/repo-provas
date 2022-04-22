import api from "./api";

export default class AuthApi {
  login(data) {
    return api.post("/login", data);
  }
}