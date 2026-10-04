import React from "react";
import styled from "styled-components";
import LockIcon from "@mui/icons-material/Lock";
import useStrings from "../../hooks/useStrings.hook";

const Styled = styled.div`
  text-align: center;
  padding-top: 5%;

  .playerProfilePrivateTitle {
    font-size: 2rem;
    margin-bottom: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lockIcon {
    font-size: 1.8rem;
    margin-right: 2%;
  }

  .playerProfilePrivateDescription {
    margin-bottom: 2%;
  }

`;

const PlayerProfilePrivate = () => {
  const strings = useStrings();
  const playerProfilePrivateTitle = (
    strings.player_profile_private_title || ""
  ).toUpperCase();

  return (
    <Styled>
      <div>
        <div className="playerProfilePrivateTitle">
          <LockIcon className="lockIcon" />
          <div>{playerProfilePrivateTitle}</div>
        </div>
        <div className="playerProfilePrivateDescription">
          {strings.player_profile_private_description}
        </div>
      </div>
    </Styled>
  );
};

export default PlayerProfilePrivate;
