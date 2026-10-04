import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { Suspense } from "react";
import Helmet from "react-helmet";
import { Route, Switch, withRouter } from "react-router-dom";
import styled from "styled-components";

import Combos from "../Combos/Combos";
import constants from "../constants";
import Distributions from "../Distributions/Distributions";
import Footer from "../Footer/Footer";
import FourOhFour from "../FourOhFour/FourOhFour";
import Header from "../Header/Header";
import Home from "../Home/Home";
import Matches from "../Matches/Matches";
import Player from "../Player/Player";
import Records from "../Records/Records";
import Request from "../Request/Request";
import Scenarios from "../Scenarios/Scenarios";
import Search from "../Search/Search";
import Teams from "../Teams/Teams";
import Spinner from "../Spinner/Spinner";
import Players from "../Players/Players";
import Heroes from "../Heroes/Heroes";
import useStrings from "../../hooks/useStrings.hook";

const Status = React.lazy(() => import("../Status/Status"));
const Explorer = React.lazy(() => import("../Explorer/Explorer"));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#8b7bff" },
    secondary: { main: "#22d3ee" },
    background: { default: "#090b12", paper: "#141826" },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.035)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(8, 10, 18, 0.96)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          fontSize: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          display: "inline-flex",
          alignItems: "center",
          textTransform: "none",
          fontFamily: constants.fontFamilyFuturistic,
          fontSize: constants.fontSizeMedium,
          fontWeight: 500,
          borderRadius: 10,
          transition: "all 200ms ease",
          "&:hover": {
            filter: "brightness(1.15)",
          },
        },
        startIcon: {
          marginRight: 6,
          "& .MuiSvgIcon-root": {
            fontSize: "1rem",
          },
        },
      },
    },
  },
});

type AppStylesProps = {
  open?: boolean;
  location?: {
    pathname?: string;
  };
};

type Back2TopStylesProps = {
  open?: boolean;
  location?: {
    pathname: string;
  };
};

type AppProps = {
  location?: any;
};

const StyledDiv = styled.div<AppStylesProps>`
  transition: ${constants.normalTransition};
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: ${(props) => (props.open ? "256px" : "0px")};
  margin-top: 0px;
`;

const Back2Top = styled.button<Back2TopStylesProps>`
  position: fixed;
  left: auto;
  right: 20px;
  top: auto;
  bottom: 24px;
  outline: none;
  color: ${constants.textColorPrimary};
  text-align: center;
  border: 1px solid ${constants.borderStrong};
  background-color: rgba(20, 24, 38, 0.85);
  backdrop-filter: blur(10px);
  width: 48px;
  font-size: 12px;
  border-radius: 14px;
  cursor: pointer;
  z-index: 999999;
  opacity: 0;
  display: block;
  pointer-events: none;
  -webkit-transform: translate3d(0, 0, 0);
  padding: 6px 3px;
  transition: opacity 0.3s ease-in-out, background 0.2s ease;

  &:hover {
    background: ${constants.gradient};
    border-color: transparent;
  }

  #back2TopTxt {
    font-size: 9px;
    line-height: 12px;
    text-align: center;
    margin-top: 2px;
  }
`;

const StyledBodyDiv = styled.div`
  padding: 0px 25px 40px 25px;
  flex-grow: 1;

  @media only screen and (min-width: ${constants.appWidth}px) {
    width: ${constants.appWidth}px;
    margin: auto;
  }
`;

const AdBannerDiv = styled.div`
  text-align: center;
  margin-bottom: 5px;

  img {
    margin-top: 10px;
    max-width: 100%;
  }
`;

declare let window: Window & { adsbygoogle: any };

const App = (props: AppProps) => {
  const strings = useStrings();
  const { location } = props;

  const back2Top = React.useRef<HTMLButtonElement>();

  React.useEffect(() => {
    const handleScroll = () => {
      let wait = false;
      const { current } = back2Top;

      if (!wait && current) {
        if (
          document.body.scrollTop > 1000 ||
          document.documentElement.scrollTop > 1000
        ) {
          current.style.opacity = "1";
          current.style.pointerEvents = "auto";
        } else {
          current.style.opacity = "0";
          current.style.pointerEvents = "none";
        }
      }
      setTimeout(() => {
        wait = !wait;
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const includeAds = !["/", "/api-keys", "/status"].includes(location.pathname);

  return (
    <ThemeProvider theme={darkTheme}>
      <Suspense fallback={<Spinner />}>
        <StyledDiv {...props}>
          <Helmet
            defaultTitle={strings.title_default}
            titleTemplate={strings.title_template}
          />
          <Header location={location} />
          <StyledBodyDiv {...props}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                exact
                path="/matches/:matchId?/:info?"
                component={Matches}
              />
              <Route
                exact
                path="/players/:playerId/:info?/:subInfo?"
                component={Player}
              />
              <Route exact path="/heroes/:heroId?/:info?" component={Heroes} />
              <Route exact path="/teams/:teamId?/:info?" component={Teams} />
              <Route exact path="/players" component={Players} />
              <Route
                exact
                path="/distributions/:info?"
                component={Distributions}
              />
              <Route exact path="/request" component={Request} />
              <Route exact path="/status" component={Status} />
              <Route exact path="/explorer" component={Explorer} />
              <Route exact path="/combos" component={Combos} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/records/:info?" component={Records} />
              {/* <Route exact path="/meta" component={Meta} /> */}
              <Route exact path="/scenarios/:info?" component={Scenarios} />
              {/* <Route exact path="/predictions" component={Predictions} /> */}
              <Route component={FourOhFour} />
            </Switch>
          </StyledBodyDiv>
          <Footer />
          <Back2Top
            //@ts-expect-error
            ref={back2Top} // type 'undefined' is not assignable to type 'HTMLButtonElement | null'
            id="back2Top"
            title={strings.back2Top}
            onClick={() => {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }}
          >
            <div>&#9650;</div>
            <div id="back2TopTxt">{strings.back2Top}</div>
          </Back2Top>
        </StyledDiv>
      </Suspense>
    </ThemeProvider>
  );
};

export default withRouter(App);
