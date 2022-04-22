import AuthApi from "../services/AuthApi";
import UserApi from "../services/UserApi";

export default function useApi() {
  return{
    user: new UserApi(),
    auth: new AuthApi(),
  }
}