import { Fragment, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import useDisciplines from "../../hooks/useDisciplines";
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
  CustomizedP
} from "./style";

export default function Courses() {
  const { auth, logout } = useAuth();
  const { disciplines, setDisciplines } = useDisciplines();
  const [categories, setCategories] = useState(null);
  const navigate = useNavigate();
  const api = useApi();

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    handleDisciplines();

    // eslint-disable-next-line
  }, []);

  async function handleDisciplines() {
    const headers = { headers: { Authorization: `Bearer ${auth?.token}` } };

    try {
      const { data } = await api.courses.getDisciplines(headers);
      setDisciplines(data);

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

  if (!disciplines || !categories) return "Carregando...";

  const data = disciplines.map((term) => {
    return {
      term: term.number,
      disciplines: term.discipline.map((discipline) => {
        return {
          disciplineName: discipline.name,
          disciplineCategory: categories.map((category) => {
            return {
              categoryName: category.name,
              tests: discipline.teachersDisciplines.map((teacherDiscipline) => {
                const teacherName = teacherDiscipline.teacher.name;

                return {
                  teacherTests: teacherDiscipline.test.filter((test) => test.categoryId === category.id).map(element => {
                    return {
                      ...element,
                      teacherName
                    }
                  })
                }
              })
            }
          })
        }
      })
    };
  });

  const disciplinesReader = data?.map((course) => {
    return (
      <Accordion
        key={course.term}
        expanded={expanded === `panel${course.term}`}
        onChange={handleChange(`panel${course.term}`)}
        sx={{ display: course.disciplines.length === 0 && "none" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${course.term}bh-content`}
          id={`panel${course.term}bh-header`}
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {`${course.term}º Período`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {course.disciplines.map((discipline) => {
            return (
              <Accordion key={discipline.disciplineName}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{discipline.disciplineName}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {discipline.disciplineCategory.map((category) => {
                    const displayP = category.tests.filter((test) => (
                      test.teacherTests.length > 0
                    ));

                    return (
                      <div key={category.categoryName}>
                        <CustomizedP displayP={displayP.length}>
                          {category.categoryName}
                          <br />

                          {category.tests.map(test => (
                            test.teacherTests.map((teacherTest) => {
                              return (
                                <Fragment key={teacherTest.categoryId}>
                                  <span>
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={teacherTest.pdfUrl}
                                    >
                                      {`${teacherTest.name} (${teacherTest.teacherName})`}
                                    </a>
                                  </span><br />
                                </Fragment>
                              );
                            })
                          ))}
                        </CustomizedP>
                      </div>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </AccordionDetails>
      </Accordion>
    );
  });

  return (
    <Container>
      <Content>
        <NavSection>
          <CustomizedLink to='/courses'>
            <Button variant="contained">DISCIPLINAS</Button>
          </CustomizedLink>

          <CustomizedLink to='/instructors'>
            <Button variant="outlined">PESSOA INSTRUTORA</Button>
          </CustomizedLink>

          <Button variant="outlined">ADICIONAR</Button>
        </NavSection>

        <AcordeonContainer>
          {disciplinesReader}
        </AcordeonContainer>
      </Content>
    </Container>
  );
}