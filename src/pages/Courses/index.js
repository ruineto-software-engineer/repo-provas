import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
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
  AcordeonContainer
} from "./style";

export default function Courses() {
  const [disciplines, setDisciplines] = useState(null);
  const { auth, logout } = useAuth();
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

  if (!disciplines) return "Carregando...";

  const disciplinesReader = disciplines.map((course) => {
    return (
      <Accordion
        key={course.id}
        expanded={expanded === `panel${course.id}`}
        onChange={handleChange(`panel${course.id}`)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${course.id}bh-content`}
          id={`panel${course.id}bh-header`}
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {`${course.number}º Período`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {course.discipline.map((discipline) => {
            return (
              <Accordion key={discipline.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{discipline.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {discipline.teachersDisciplines.map((teacherDiscipline) => {
                    const teacherName = teacherDiscipline.teacher.name;

                    return (
                      <div key={teacherDiscipline.id}>
                        {
                          teacherDiscipline.test.map((exam) => {
                            return (
                              <div key={exam.id}>
                                <p>{exam.category.name}</p>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={exam.pdfUrl}
                                >
                                  {`${exam.name} (${teacherName})`}
                                </a>
                              </div>
                            );
                          })
                        }
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
  })

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

          <Button variant="outlined">ADICIONAR</Button>
        </NavSection>

        <AcordeonContainer>
          {disciplinesReader}
        </AcordeonContainer>
      </Content>
    </Container>
  );
}