import { useNavigate, useLocation } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import useDisciplines from '../../hooks/useDisciplines';
import useInstructors from '../../hooks/useInstructors';
import Logo from "../../assets/img/logo.svg";
import Logout from "../../assets/icons/logout.svg";
import TextField from '@mui/material/TextField';
import {
  Container,
  ActionContainer,
  LogoContainer,
  LogoutContainer,
  TextFieldContainer,
  TextFieldContent,
  TitleTestPage
} from "./style";
import { useEffect, useState } from 'react';

export default function Header() {
  const [termsInputValue, setTermsInputValue] = useState('');
  const [instructorsInputValue, setInstructorsInputValue] = useState('');
  const { auth, logout } = useAuth();
  const { setDisciplines } = useDisciplines();
  const { setInstructors } = useInstructors();
  const navigate = useNavigate();
  const location = useLocation();
  const api = useApi();
  const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };

  useEffect(() => {
    setTermsInputValue('');
    setInstructorsInputValue('');
  }, [location.pathname])

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

  const handleTermsKeyDown = async (event) => {
    if (event.key === 'Enter') {
      try {
        const { data } = await api.courses.getDisciplinesByName(termsInputValue, headers);

        setDisciplines(data);
      } catch (error) {
        if (error.response.status === 401) {
          Swal.fire({
            title: 'Oops...',
            text: "Sua sessão expirou, faça login novamente para acessar!",
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

    if (event.key === 'Escape') {
      setTermsInputValue('');

      try {
        const { data } = await api.courses.getDisciplines(headers);

        setDisciplines(data);
      } catch (error) {
        if (error.response.status === 401) {
          Swal.fire({
            title: 'Oops...',
            text: "Sua sessão expirou, faça login novamente para acessar!",
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
  }

  const handleInstructorsKeyDown = async (event) => {
    if (event.key === 'Enter') {
      try {
        const { data } = await api.instructors.getInstructorsByName(instructorsInputValue, headers);

        setInstructors(data);
      } catch (error) {
        if (error.response.status === 401) {
          Swal.fire({
            title: 'Oops...',
            text: "Sua sessão expirou, faça login novamente para acessar!",
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

    if (event.key === 'Escape') {
      setInstructorsInputValue('');

      try {
        const { data } = await api.instructors.getInstructors(headers);

        setInstructors(data);
      } catch (error) {
        if (error.response.status === 401) {
          Swal.fire({
            title: 'Oops...',
            text: "Sua sessão expirou, faça login novamente para acessar!",
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
  }

  return (
    <Container pathname={location.pathname}>
      <ActionContainer>
        <LogoContainer onClick={() => navigate("/courses")}>
          <img alt="logo.svg" src={Logo} />
        </LogoContainer>

        <LogoutContainer onClick={() => handleLogout(auth?.userId)}>
          <img alt="logout.svg" src={Logout} />
        </LogoutContainer>
      </ActionContainer>

      <TextFieldContainer>
        <TextFieldContent>
          {location.pathname === '/courses' ?
            <TextField
              sx={{ width: '100%' }}
              id="outlined-basic-header-courses"
              label="Pesquise por disciplina"
              variant="outlined"
              value={termsInputValue}
              onChange={(e) => setTermsInputValue(e.target.value)}
              onKeyDown={handleTermsKeyDown}
            />
            :
              location.pathname === '/instructors' ?
                <TextField
                  sx={{ width: '100%' }}
                  id="outlined-basic-header-instructors"
                  label="Pesquise por pessoa instrutora"
                  variant="outlined"
                  value={instructorsInputValue}
                  onChange={(e) => setInstructorsInputValue(e.target.value)}
                  onKeyDown={handleInstructorsKeyDown}
                />
              :
              <TitleTestPage>Adicione uma prova</TitleTestPage>
          }
        </TextFieldContent>
      </TextFieldContainer>
    </Container>
  );
}