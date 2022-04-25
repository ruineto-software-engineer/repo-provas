import { useNavigate, useLocation } from 'react-router-dom';
import { fireAlert } from "../../utils/alerts";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Logo from "../../assets/img/logo.svg";
import Logout from "../../assets/icons/logout.svg";
import TextField from '@mui/material/TextField';
import {
  Container,
  ActionContainer,
  LogoContainer,
  LogoutContainer,
  TextFieldContainer,
  TextFieldContent
} from "./style";

export default function Header() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const api = useApi();

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

  return (
    <Container pathname={location.pathname}>
      <ActionContainer>
        <LogoContainer>
          <img alt="logo.svg" src={Logo} />
        </LogoContainer>

        <LogoutContainer onClick={() => handleLogout(auth.userId)}>
          <img alt="logout.svg" src={Logout} />
        </LogoutContainer>
      </ActionContainer>

      <TextFieldContainer>
        <TextFieldContent>
          <TextField
            sx={{ width: '100%' }}
            id="outlined-basic-header"
            label="Pesquise por disciplina"
            variant="outlined"
          />
        </TextFieldContent>
      </TextFieldContainer>
    </Container>
  );
}