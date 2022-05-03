import { useNavigate, useLocation } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import useDisciplines from '../../hooks/useDisciplines';
import useInstructors from '../../hooks/useInstructors';
import useInstructorsInputValue from '../../hooks/useInstructorsInputValue';
import useTermsInputValue from '../../hooks/useTermsInputValue';
import Logo from "../../assets/img/logo.svg";
import Logout from "../../assets/icons/logout.svg";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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
  const { termsInputValue, setTermsInputValue } = useTermsInputValue();
  const [allDisciplines, setAllDisciplines] = useState(null);
  const [allDisciplineInputValue, setAllDisciplineInputValue] = useState("");

  const { instructorsInputValue, setInstructorsInputValue } = useInstructorsInputValue();
  const [allInstructors, setAllInstructors] = useState(null);
  const [allInstructorsInputValue, setAllInstructorsInputValue] = useState("");

  const { auth, logout } = useAuth();
  const { setDisciplines } = useDisciplines();
  const { setInstructors } = useInstructors();

  const [session, setSession] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const api = useApi();
  const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };

  useEffect(() => {
    if (auth?.token) {
      if (session) {
        handleFilterDisciplines();
        handleFilterInstructors();
      }
    }
  }, [termsInputValue, instructorsInputValue]);

  useEffect(() => {
    setTermsInputValue('');
    setInstructorsInputValue('');

    if (auth?.token) {
      if (session) {
        handleDisciplines();
        handleInstructors();
      }
    }
  }, [location.pathname]);

  async function handleLogout(userId) {
    setSession(false);

    try {
      await api.auth.logout(userId);

      logout();
      navigate("/");
      window.location.reload(true);
    } catch (error) {
      fireAlert(error.response.data);
      navigate("/");
    }
  }

  async function handleFilterDisciplines() {
    try {
      let promise;
      if (!termsInputValue) {
        promise = await api.courses.getDisciplines(headers);
      } else {
        promise = await api.courses.getDisciplinesByName(termsInputValue.label, headers);
      }

      setDisciplines(promise.data);
    } catch (error) {
      if (error.response.status === 401) {
        setSession(false);
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

  async function handleFilterInstructors() {
    try {
      let promise;
      if (!instructorsInputValue) {
        promise = await api.instructors.getInstructors(headers);
      } else {
        promise = await api.instructors.getInstructorsByName(instructorsInputValue.label, headers);
      }

      setInstructors(promise.data);
    } catch (error) {
      if (error.response.status === 401) {
        setSession(false);
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

  async function handleDisciplines() {
    try {
      const { data } = await api.instructors.getDisciplines(headers);

      setAllDisciplines(data);
    } catch (error) {
      if (error.response.status === 401) {
        setSession(false);
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
      }
    }
  }

  async function handleInstructors() {
    try {
      const { data } = await api.instructors.getInstructors(headers);

      setAllInstructors(data);
    } catch (error) {
      if (error.response.status === 401) {
        setSession(false);
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
      }
    }
  }

  const allDisciplinesOptions = allDisciplines?.map((discipline) => {
    return {
      id: discipline.id,
      label: discipline.name
    };
  });

  const allInstructorsOptions = allInstructors?.map((instructor) => {
    return {
      id: instructor.id,
      label: instructor.name
    };
  });

  if (!allDisciplines || !allInstructors) return " ";

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
            <Autocomplete
              fullWidth
              value={termsInputValue}
              onChange={(event, newValue) => {
                setTermsInputValue(newValue);
              }}
              inputValue={allDisciplineInputValue}
              onInputChange={(event, newInputValue) => {
                setAllDisciplineInputValue(newInputValue);
                handleFilterDisciplines();
              }}
              id="controllable-states-terms"
              options={allDisciplinesOptions}
              isOptionEqualToValue={(termsInputValue) => { return ({ id: termsInputValue.id, label: termsInputValue.name }) }}
              renderInput={(params) => <TextField {...params} label="Pesquise por disciplina" />}
            />
            :
            location.pathname === '/instructors' ?
              <Autocomplete
                fullWidth
                value={instructorsInputValue}
                onChange={(event, newValue) => {
                  setInstructorsInputValue(newValue);
                }}
                inputValue={allInstructorsInputValue}
                onInputChange={(event, newInputValue) => {
                  setAllInstructorsInputValue(newInputValue);
                  handleFilterInstructors();
                }}
                id="controllable-states-instructors"
                options={allInstructorsOptions}
                isOptionEqualToValue={(termsInputValue) => { return ({ id: termsInputValue.id, label: termsInputValue.name }) }}
                renderInput={(params) => <TextField {...params} label="Pesquise por pessoa instrutora" />}
              />
              :
              <TitleTestPage>Adicione uma prova</TitleTestPage>
          }
        </TextFieldContent>
      </TextFieldContainer>
    </Container>
  );
}