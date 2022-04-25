import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding-top: 200px;

  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 50%;

  @media screen and (max-width: 650px) {
    width: 80%;
  }
`;

const NavSection = styled.div`
  width: 100%;
  height: 40px;

  margin-bottom: 50px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 650px) {
    padding: 60px 0 50px 0;

    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }
`;

const AcordeonContainer = styled.div`
  width: 100%;

  padding-bottom: 100px;
`;

const CustomizedLink = styled(Link)`
  text-decoration: none;
`;

export {
  Container,
  Content,
  NavSection,
  CustomizedLink,
  AcordeonContainer
}

