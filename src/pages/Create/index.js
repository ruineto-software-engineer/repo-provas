import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fireAlert, fireToast } from '../../utils/alerts';
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Button from '@mui/material/Button';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Container,
  Content,
  NavSection,
  CustomizedLink,
  FormContainer
} from "./style";

export default function Create() {
  const [titleTest, setTitleTest] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryInputValue, setCategoryInputValue] = useState('');

  const [discipline, setDiscipline] = useState(null);
  const [disciplines, setDisciplines] = useState(null);
  const [disciplineInputValue, setDisciplineInputValue] = useState('');

  const [instructor, setInstructor] = useState(null);
  const [instructors, setInstructors] = useState(null);
  const [instructorInputValue, setInstructorInputValue] = useState('');

  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const api = useApi();
  const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };

  useEffect(() => {
    if (!auth?.token) {
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleCategories();
    handleDisciplines();
    handleInstructors();

    // eslint-disable-next-line
  }, [discipline]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titleTest || !pdfUrl || !category || !discipline || !instructor) {
      return fireAlert("Existem campos vazios! Reveja e tente novamente!");
    }

    const testData = {
      name: titleTest,
      pdfUrl: pdfUrl,
      categoryId: category.id,
      views: 0,
      disciplineId: discipline.id,
      teacherId: instructor.id
    }

    try {
      await api.instructors.createTestByInstructor(testData, headers);

      setTitleTest('');
      setPdfUrl('');
      setCategory(null);
      setDiscipline(null);
      setInstructor(null);

      fireToast('success', 'Prova cadastrada com sucesso!');
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
      }
    }
  }

  async function handleCategories() {
    try {
      const { data } = await api.instructors.getCategories(headers);

      setCategories(data);
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
        if(!auth?.token) return fireAlert("Você precisa estar logado para acessar!");

        fireAlert(error.response.data);
      }
    }
  }

  async function handleDisciplines() {
    try {
      const { data } = await api.instructors.getDisciplines(headers);

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
        if(!auth?.token) return fireAlert("Você precisa estar logado para acessar!");

        fireAlert(error.response.data);
      }
    }
  }

  async function handleInstructors() {
    try {
      let promise;
      if (discipline !== null) {
        promise = await api.instructors.getInstructorsByDiscipline(
          discipline.id,
          headers
        );
      } else {
        promise = await api.instructors.getInstructorsByDiscipline(
          "",
          headers
        );
      }

      setInstructors(promise.data);
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
        if(!auth?.token) return fireAlert("Você precisa estar logado para acessar!");

        fireAlert(error.response.data);
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

  const categoriesOptions = categories?.map((category) => {
    return {
      id: category.id,
      label: category.name
    };
  });

  const disciplinesOptions = disciplines?.map((discipline) => {
    return {
      id: discipline.id,
      label: discipline.name
    };
  });

  const instructorConstructor = instructors?.filter(instructor => instructor.teachersDisciplines?.length > 0);
  const instructorsOptions = instructorConstructor?.map((instructor) => {
    return {
      id: instructor.id,
      label: instructor.name
    };
  });

  if (!categories || !disciplines || !instructors) return "Carregando...";

  return (
    <Container>
      <Content>
        <NavSection>
          <CustomizedLink to='/courses'>
            <Button variant="outlined">DISCIPLINAS</Button>
          </CustomizedLink>

          <CustomizedLink to='/instructors'>
            <Button variant="outlined">PESSOA INSTRUTORA</Button>
          </CustomizedLink>

          <CustomizedLink to='/create'>
            <Button variant="contained">ADICIONAR</Button>
          </CustomizedLink>
        </NavSection>

        <FormContainer onSubmit={handleSubmit}>
          <TextField
            sx={{ width: '100%' }}
            id="outlined-basic"
            label="Titulo da prova"
            variant="outlined"
            type={'text'}
            value={titleTest}
            onChange={(e) => setTitleTest(e.target.value)}
          />
          <TextField
            sx={{ width: '100%' }}
            id="outlined-basic"
            label="PDF da prova"
            variant="outlined"
            type={'text'}
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
          />
          <Autocomplete
            fullWidth
            value={category}
            onChange={(event, newValue) => {
              setCategory(newValue);
            }}
            inputValue={categoryInputValue}
            onInputChange={(event, newInputValue) => {
              setCategoryInputValue(newInputValue);
            }}
            id="controllable-states-categories"
            options={categoriesOptions}
            isOptionEqualToValue={(category) => { return ({ id: category.id, label: category.name }) }}
            renderInput={(params) => <TextField {...params} label="Categoria" />}
          />
          <Autocomplete
            fullWidth
            value={discipline}
            onChange={(event, newValue) => {
              setDiscipline(newValue);
            }}
            inputValue={disciplineInputValue}
            onInputChange={(event, newInputValue) => {
              setDisciplineInputValue(newInputValue);
              handleInstructors();
            }}
            id="controllable-states-disciplines"
            options={disciplinesOptions}
            isOptionEqualToValue={(discipline) => { return ({ id: discipline.id, label: discipline.name }) }}
            renderInput={(params) => <TextField {...params} label="Disciplina" />}
          />          
          <Autocomplete
            fullWidth
            sx={{ pointerEvents: !discipline && 'none' }}
            value={instructor}
            onChange={(event, newValue) => {
              setInstructor(newValue);
            }}
            inputValue={instructorInputValue}
            onInputChange={(event, newInputValue) => {
              setInstructorInputValue(newInputValue);
            }}
            id="controllable-states-instructors"
            options={instructorsOptions}
            isOptionEqualToValue={(instructor) => { return ({ id: instructor.id, label: instructor.name }) }}
            renderInput={(params) => <TextField {...params} label="Pessoa Instrutora" />}
          />

          <Button
            fullWidth
            sx={{ marginTop: '10px' }}
            variant="contained"
            type="submit"
          >
            ENVIAR
          </Button>
        </FormContainer>
      </Content>
    </Container>
  );
}