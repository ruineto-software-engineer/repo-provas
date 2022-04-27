import styled from "styled-components";

const Container = styled.header`
  width: 100%;

  padding: 20px;

  display: ${(props) => (props.pathname !== "/") && (props.pathname !== "/register") ? "flex" : "none"};
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  position: fixed;
  top: 0;
  left: 0;

  background-color: #FFFFFF;
  z-index: 1;

  border-bottom: 1px solid #C4C4C4;
`;

const ActionContainer = styled.div`
  width: 100%;

  margin-bottom: 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  img{
    width: 200px;
  }
`;

const LogoutContainer = styled.div`
  cursor: pointer;

  img{
    width: 30px;
  }
`;

const TextFieldContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextFieldContent = styled.div`
  width: 464px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleTestPage = styled.h2`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;

  color: rgba(0, 0, 0, 0.8);
`;

export {
  Container,
  ActionContainer,
  LogoContainer,
  LogoutContainer,
  TextFieldContainer,
  TextFieldContent,
  TitleTestPage
};