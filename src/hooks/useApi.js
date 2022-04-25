import AuthApi from "../services/AuthApi";
import CoursesApi from "../services/CoursesApi";
import UserApi from "../services/UserApi";
import InstructorsApi from "../services/InstructorsApi";

export default function useApi() {
  return{
    user: new UserApi(),
    auth: new AuthApi(),
    courses: new CoursesApi(),
    instructors: new InstructorsApi()
  }
}