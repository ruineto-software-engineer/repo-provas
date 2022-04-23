import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Swal from "sweetalert2";

export default function Courses() {
  const [disciplines, setDisciplines] = useState(null);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    handleDisciplines();

    // eslint-disable-next-line
  }, []);

  async function handleDisciplines() {
    const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };
    
    try {
      const { data } = await api.courses.getDisciplines(headers);

      setDisciplines(data);
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

  if(!disciplines) return "Carregando...";

  console.log(disciplines);

  return (
    <div>
      <p>{`Entrei na página de Disciplinas!\nemail: ${auth.email}`}</p>
      <button onClick={() => handleLogout(auth.userId)}>Logout</button>
    </div>
  );
}