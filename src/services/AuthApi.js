import api from "./api";

export default class AuthApi {
  login(data) {
    return api.post("/login", data);
  }

  logout(userId){
    return api.delete(`/logout/${userId}`);
  }
}