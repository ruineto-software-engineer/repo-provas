import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Swal from "sweetalert2";

export default function Instructors() {
  const [instructors, setInstructors] = useState(null);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    handleInstructors();

    // eslint-disable-next-line
  }, []);

  async function handleInstructors() {
    const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };
    
    try {
      const { data } = await api.instructors.getInstructors(headers);

      setInstructors(data);
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          title: 'Oops...',
          text: "Your session expired, login again to access!",
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            handleLogout(auth.userId);
          }
        })
      } else {
        fireAlert(error.response.data);
        navigate("/");
      }
    }
  }

  async function handleLogout(userId) {
    try {
      await api.auth.logout(userId);

      logout();
      navigate("/");
    } catch (error) {
      fireAlert(error.response.data);
      navigate("/");
    }
  }

  if(!instructors) return "Carregando...";

  console.log(instructors);

  return (
    <div>
      <p>{`Entrei na página de Instrutores!\nemail: ${auth.email}`}</p>
      <button onClick={() => handleLogout(auth.userId)}>Logout</button>
      <Link to='/courses'>Períodos</Link>
    </div>
  );
}