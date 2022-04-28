import { Fragment, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import useInstructors from "../../hooks/useInstructors";
import Button from '@mui/material/Button';
import Swal from "sweetalert2";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Container,
  Content,
  NavSection,
  CustomizedLink,
  AcordeonContainer,
  CustomizedP,
  CustomizedA,
  Views,
  TestContainer
} from "./style";

export default function Instructors() {
  const [categories, setCategories] = useState(null);
  const [reload, setReload] = useState(false);
  const { auth, logout } = useAuth();
  const { instructors, setInstructors } = useInstructors();
  const navigate = useNavigate();
  const api = useApi();
  const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    handleInstructors();

    // eslint-disable-next-line
  }, [reload]);

  async function handleInstructors() {
    try {
      const instructorsPromise = await api.instructors.getInstructors(headers);
      setInstructors(instructorsPromise.data);

      const categoriesPromise = await api.instructors.getCategories(headers);
      setCategories(categoriesPromise.data);
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

  async function handleUpdateViews(testId) {
    try {
      await api.instructors.updateTestViewsById(testId, headers);

      setReload(!reload);
    } catch (error) {
      if (error.response?.status === 401) {
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

  if (!instructors || !categories) return "Carregando...";

  const data = instructors.map((instructor) => {
    return ({
      instructorName: instructor.name,
      categories: categories.map((category) => {
        return {
          categoryName: category.name,
          tests: instructor.teachersDisciplines.map((teacherDiscipline) => {
            const disciplineName = teacherDiscipline.discipline.name;

            return {
              teacherTests: teacherDiscipline.test.filter((test) => test.categoryId === category.id).map(element => {
                return {
                  ...element,
                  disciplineName
                }
              })
            }
          })
        }
      })
    });
  });

  const instructorsReader = data.map((instructor) => {
    return (
      <Accordion
        key={instructor.instructorName}
        expanded={expanded === `panel${instructor.instructorName}`}
        onChange={handleChange(`panel${instructor.instructorName}`)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${instructor.instructorName}bh-content`}
          id={`panel${instructor.instructorName}bh-header`}
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {instructor.instructorName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '10px'
        }}>
          {instructor.categories.map((category) => {
            const displayP = category.tests.filter((test) => (
              test.teacherTests.length > 0
            ));

            return (
              <CustomizedP
                key={category.categoryName}
                displayP={displayP.length}
              >
                {category.categoryName}
                <br />

                {category.tests.map(test => (
                  test.teacherTests.map((teacherTest) => {
                    return (
                      <Fragment key={teacherTest.id}>
                        <TestContainer>
                          <CustomizedA
                            target="_blank"
                            rel="noopener noreferrer"
                            href={teacherTest.pdfUrl}
                            onClick={() => handleUpdateViews(teacherTest.id)}
                          >
                            {`${teacherTest.name} (${teacherTest.disciplineName})`}
                          </CustomizedA>

                          <Views>
                            {`visualizações: ${teacherTest.views}`}
                          </Views>
                        </TestContainer>
                      </Fragment>
                    );
                  })
                ))}
              </CustomizedP>
            );
          })}
        </AccordionDetails>
      </Accordion >
    );
  });

  return (
    <Container>
      <Content>
        <NavSection>
          <CustomizedLink to='/courses'>
            <Button variant="outlined">DISCIPLINAS</Button>
          </CustomizedLink>

          <CustomizedLink to='/instructors'>
            <Button variant="contained">PESSOA INSTRUTORA</Button>
          </CustomizedLink>

          <CustomizedLink to='/create'>
            <Button variant="outlined">ADICIONAR</Button>
          </CustomizedLink>
        </NavSection>

        <AcordeonContainer>
          {instructorsReader}
        </AcordeonContainer>
      </Content>
    </Container>
  );
}