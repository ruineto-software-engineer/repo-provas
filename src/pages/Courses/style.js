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

const CustomizedP = styled.p`
  display: ${(props) => props.displayP === 0 && 'none' };

  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.15px;

  width: 100%;

  padding: 0 10px;

  color: #000000;
`;

const CustomizedA = styled.a`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.15px;
  text-decoration: none;

  color: #878787;

  :hover{
    text-decoration: underline;
  }
`;

const Views = styled.span`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.15px;

  color: #878787;
`;

const TestContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  @media screen and (max-width: 650px){
    flex-direction: column;
    align-items: flex-start;

    margin-bottom: 20px;
  }
`;

export {
  Container,
  Content,
  NavSection,
  CustomizedLink,
  AcordeonContainer,
  CustomizedP,
  CustomizedA,
  Views,
  TestContainer
}

