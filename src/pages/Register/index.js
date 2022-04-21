import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function Register() {
  const [values, setValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });
  const [confirm, setConfirm] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleChangeConfirm = (prop) => (event) => {
    setConfirm({ ...confirm, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleClickShowPasswordConfirm = () => {
    setConfirm({
      ...confirm,
      showPassword: !confirm.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownPasswordConfirm = (event) => {
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
          <TitlePage>Cadastro</TitlePage>

          <CustomizedButton sx={{ width: '100%' }} variant="contained">
            ENTRAR COM O GITHUB
          </CustomizedButton>

          <CustomizedDivider>ou</CustomizedDivider>

          <Form>
            <TextField
              sx={{ width: '100%' }}
              id="outlined-basic"
              label="Email"
              variant="outlined"
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

            <FormControl sx={{ width: '100%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Confirme sua senha</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={confirm.showPassword ? 'text' : 'password'}
                value={confirm.password}
                onChange={handleChangeConfirm('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordConfirm}
                      onMouseDown={handleMouseDownPasswordConfirm}
                      edge="end"
                    >
                      {confirm.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirme sua senha"
              />
            </FormControl>

            <FormFooter>
              <CustomizedLink to='/' underline="always">
                {'Já possuo cadastro'}
              </CustomizedLink>

              <Button variant="contained">CADASTRAR</Button>
            </FormFooter>
          </Form>
        </div>
      </Content>
    </Container>
  );
}