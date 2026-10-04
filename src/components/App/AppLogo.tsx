import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import constants from "../constants";
import useStrings from "../../hooks/useStrings.hook";

const StyledLink = styled(Link)`
  font-weight: 700;
  color: ${constants.textColorPrimary};
  letter-spacing: 0.04em;
  text-transform: uppercase;

  & span {
    background: ${constants.gradient};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  &:hover {
    opacity: 0.85;
  }
`;

interface AppLogoProps {
  size?: string;
  onClick?: () => void;
}

const AppLogo = ({ size, onClick }: AppLogoProps) => {
  const strings = useStrings();
  return (
    <StyledLink
      aria-label="FominDota"
      to="/"
      onClick={onClick}
    >
      <span
        style={{
          fontFamily: constants.fontFamilyFuturistic,
          fontSize: size || "1.15rem",
          whiteSpace: "nowrap",
        }}
      >
        {strings.app_name}
      </span>
    </StyledLink>
  );
};

export default AppLogo;
