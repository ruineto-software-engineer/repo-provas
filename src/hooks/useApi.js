import AuthApi from "../services/AuthApi";
import CoursesApi from "../services/CoursesApi";
import UserApi from "../services/UserApi";

export default function useApi() {
  return{
    user: new UserApi(),
    auth: new AuthApi(),
    courses: new CoursesApi()
  }
}