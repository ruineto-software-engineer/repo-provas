import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { fireAlert, fireToast } from '../../utils/alerts';
import { styled } from '@mui/material/styles';
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Button from '@mui/material/Button';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import supabase from '../../supabaseClient';
import {
  Container,
  Content,
  NavSection,
  CustomizedLink,
  FormContainer
} from "./style";

const Input = styled('input')({
  display: 'none',
});

export default function Create() {
  const [titleTest, setTitleTest] = useState('');
  const [pdf, setPdf] = useState('');

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryInputValue, setCategoryInputValue] = useState('');

  const [discipline, setDiscipline] = useState(null);
  const [disciplines, setDisciplines] = useState(null);
  const [disciplineInputValue, setDisciplineInputValue] = useState('');

  const [instructor, setInstructor] = useState(null);
  const [instructors, setInstructors] = useState(null);
  const [instructorInputValue, setInstructorInputValue] = useState('');

  const { register, handleSubmit } = useForm();
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

  async function onSubmit({ file }) {
    const formData = new FormData();

    if (!titleTest || !category || !discipline || !instructor) {
      return fireAlert("Existem campos vazios! Reveja e tente novamente!");
    }

    console.log("file: ", file);

    formData.append("file", file[0]);

    console.log("formInfo: ", formData);

    const testData = {
      name: titleTest,
      pdf: pdf,
      categoryId: category.id,
      views: 0,
      disciplineId: discipline.id,
      teacherId: instructor.id
    }

    formData.append("testData", JSON.stringify(testData));

    console.log(testData);

    try {
      supabase.auth.signIn({ email: 'ruineto11@gmail.com' });

      /* await api.instructors.createTestByInstructor(testData, headers); */
      /* await api.instructors.createTestByInstructorFormData(formData, headers); */

      const pdfFile = file;
      const { data, error } = await supabase
        .storage
        .from('uploads')
        .upload(`public/${file['0'].name}`, pdfFile, {
          cacheControl: '3600',
          upsert: false
        });

      console.log("data: ", data);
      console.log("error: ", error);

      setTitleTest('');
      setPdf('');
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
        if (!auth?.token) return fireAlert("Você precisa estar logado para acessar!");

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
        if (!auth?.token) return fireAlert("Você precisa estar logado para acessar!");

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
        if (!auth?.token) return fireAlert("Você precisa estar logado para acessar!");

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

        <FormContainer
          onSubmit={handleSubmit((data) => onSubmit(data))}
          enctype="multipart/form-data"
        >
          <TextField
            sx={{ width: '100%' }}
            id="outlined-basic"
            label="Titulo da prova"
            variant="outlined"
            type={'text'}
            value={titleTest}
            onChange={(e) => setTitleTest(e.target.value)}
            required
          />
          <input
            {...register("file")}
            style={{ width: '100%' }}
            accept=".pdf"
            name="file"
            id="outlined-basic"
            label="PDF da prova"
            variant="outlined"
            type={'file'}
            required
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
            renderInput={(params) => <TextField {...params} label="Categoria" required />}
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
            renderInput={(params) => <TextField {...params} label="Disciplina" required />}
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
            renderInput={(params) => <TextField {...params} label="Pessoa Instrutora" required />}
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