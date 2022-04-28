import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fireAlert, fireToast } from '../../utils/alerts';
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Button from '@mui/material/Button';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(null);
  const [discipline, setDiscipline] = useState('');
  const [disciplines, setDisciplines] = useState(null);
  const [instructor, setInstructor] = useState('');
  const [instructors, setInstructors] = useState(null);
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const api = useApi();
  const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };

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
      categoryId: category,
      views: 0,
      disciplineId: discipline,
      teacherId: instructor
    }

    console.log(testData);
    try {
      await api.instructors.createTestByInstructor(testData, headers);

      setTitleTest('');
      setPdfUrl('');
      setCategory('');
      setDiscipline('');
      setInstructor('');

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
        fireAlert(error.response.data);
      }
    }
  }

  async function handleInstructors() {
    try {
      const { data } = await api.instructors.getInstructorsByDiscipline(discipline, headers);

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

  const categoriesReader = categories?.map((category) => {
    return (
      <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
    );
  });

  const disciplinesReader = disciplines?.map((discipline) => {
    return (
      <MenuItem key={discipline.id} value={discipline.id}>{discipline.name}</MenuItem>
    );
  });

  const instructorConstructor = instructors?.filter(instructor => instructor.teachersDisciplines?.length > 0);
  const instructorsReader = instructorConstructor?.map((instructor) => {
    return (
      <MenuItem key={instructor.id} value={instructor.id}>
        {instructor.name}
      </MenuItem>
    );
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Categoria"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoriesReader}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Disciplina</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={discipline}
              label="Disciplina"
              onChange={(e) => setDiscipline(e.target.value)}
              onClick={handleInstructors}
            >
              {disciplinesReader}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ pointerEvents: !discipline && 'none' }}
          >
            <InputLabel id="demo-simple-select-label">Pessoa Instrutora</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={instructor}
              label="Pessoa Instrutora"
              onChange={(e) => setInstructor(e.target.value)}
            >
              {instructorsReader?.length === 0 ?
                <MenuItem value={-1} sx={{ pointerEvents: 'none' }}>
                  Não existem instrutores cadastrados para esta disciplina
                </MenuItem>
                :
                instructorsReader
              }
            </Select>
          </FormControl>

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