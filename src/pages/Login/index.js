import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fireAlert, fireToast } from '../../utils/alerts';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import Logo from '../../assets/img/logo.svg';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { 
  Container, 
  Content, 
  Form, 
  FormFooter, 
  TitlePage, 
  LogoContainer 
} from '../../components/Form';

export default function Login() {
  const [email, setEmail] = useState('');
  const [values, setValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (localStorage.getItem("auth") !== null) navigate('/courses');
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!values.password || !email)
      return fireAlert("Existem campos vazios! Reveja e tente novamente!");

    try {
      const { data } = await api.auth.login({ email, password: values.password });
      console.log(data);

      fireToast('success', 'Login realizado com sucesso!');
      login(data);
      navigate('/courses');
    } catch (error) {
      if (error.response.status === 401) {
        fireAlert("Email ou senha incorretos! Tente novamente!");
      } else {
        fireAlert(error.response.data);
      }
    }
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const CustomizedButton = styled(Button)`
    background-color: #424445;
    margin: 31px 0 17px 0;

    :hover{
      background-color: #565959;
    }
  `;

  const CustomizedLink = styled(Link)`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.15px;

    color: rgba(70, 115, 202, 0.8);

    :hover{
      color: #1976d2;
    }
  `;

  const CustomizedDivider = styled(Divider)`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.15px;

    color: rgba(0, 0, 0, 0.8);

    ::before{
      border-top: thin solid rgba(196, 196, 196);
    }

    ::after{
      border-top: thin solid rgba(196, 196, 196);
    }
  `;

  return (
    <Container>
      <Content>
        <LogoContainer>
          <img alt="logo.svg" src={Logo} />
        </LogoContainer>

        <div>
          <TitlePage>Login</TitlePage>

          <CustomizedButton sx={{ width: '100%' }} variant="contained">
            ENTRAR COM O GITHUB
          </CustomizedButton>

          <CustomizedDivider>ou</CustomizedDivider>

          <Form onSubmit={handleSubmit}>
            <TextField
              sx={{ width: '100%' }}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              type={'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl sx={{ width: '100%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Senha"
              />
            </FormControl>

            <FormFooter>
              <CustomizedLink to='/register' underline="always">
                {'Não possuo cadastro'}
              </CustomizedLink>

              <Button type="submit" variant="contained">ENTRAR</Button>
            </FormFooter>
          </Form>
        </div>
      </Content>
    </Container>
  );
}