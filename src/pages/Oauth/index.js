import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fireAlert, fireToast } from "../../utils/alerts";
import useAuth from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Oauth() {
  const { login } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    let CODE = paramsLocation.code;

    if (CODE) {
      gitHubAccessToken(CODE);
    }
  }, []);

  const paramsLocation = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  async function gitHubAccessToken(CODE) {
    try {
      const { data } = await api.auth.loginGitHub({
        code: CODE
      });

      login(data);
      fireToast('success', 'Login com GitHub realizado com sucesso!');
      navigate("/courses");
    } catch (error) {
      fireAlert(error.response.data);
      navigate("/");
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh'
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
}