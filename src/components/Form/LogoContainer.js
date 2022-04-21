import styled from "styled-components";

const LogoContainer = styled.div`
  width: 100%;

  margin-top: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  left: 0;

  @media screen and (max-width: 650px){
    img{
      width: 230px;
    }
  }
`;

export default LogoContainer;