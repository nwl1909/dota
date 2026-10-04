import React from "react";
import styled, { keyframes } from "styled-components";
import PlayerPicker from "./PlayerPicker";
import constants from "../constants";

export interface HomePageProps {
  user?: string;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 0 24px;
  text-align: center;

  @media only screen and (max-width: 768px) {
    padding-top: 40px;
  }
`;

const Eyebrow = styled.div`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${constants.border};
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${constants.textColorSecondary};
  animation: ${fadeIn} 0.5s ease both;
`;

const Title = styled.h1`
  margin: 22px 0 12px;
  font-family: ${constants.fontFamilyFuturistic};
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
  animation: ${fadeIn} 0.6s ease 0.05s both;

  & span {
    background: ${constants.gradient};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
`;

const Subtitle = styled.p`
  margin: 0 auto;
  max-width: 560px;
  font-size: 1.05rem;
  color: ${constants.textColorSecondary};
  animation: ${fadeIn} 0.6s ease 0.1s both;
`;

const Home = () => (
  <Wrapper>
    <Eyebrow>Dota 2 · статистика</Eyebrow>
    <Title>
      Чью статистику <span>показать?</span>
    </Title>
    <Subtitle>
      Выбери игрока — откроем его матчи, героев, рейтинг и всё остальное.
    </Subtitle>
    <PlayerPicker />
  </Wrapper>
);

export default Home;
