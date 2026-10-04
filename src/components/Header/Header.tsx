import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
} from "@mui/material";
import BugReport from "@mui/icons-material/BugReport";
import MenuIcon from "@mui/icons-material/Menu";
import Settings from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Toolbar } from "@mui/material";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import config from "../../config";
import AppLogo from "../App/AppLogo";
import constants from "../constants";
import LocalizationMenu from "../Localization/Localization";
import SearchForm from "../Search/SearchForm";
import useStrings from "../../hooks/useStrings.hook";

const REPORT_BUG_PATH = `https://github.com/${config.GITHUB_REPO}/issues`;

const VerticalAlignToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: ${constants.fontWeightNormal};
  height: 100%;
  justify-content: center;
  margin: 0 2px;
  text-align: center;
  position: relative;
  line-height: 1;

  @media only screen and (max-width: 1500px) {
    display: none;
  }
`;

const AppLogoWrapper = styled.div`
  line-height: 1;
`;

const DropdownMenu = styled(Menu)`
  & .MuiMenu-paper {
    background: ${constants.primarySurfaceColor};
  }
`;

const DropdownMenuItem = styled(MenuItem)`
  color: ${constants.primaryTextColor} !important;
  padding-bottom: 12px !important;
  padding-top: 12px !important;
`;

const ToolbarHeader = styled(Toolbar)`
  position: sticky;
  top: 0;
  backdrop-filter: saturate(160%) blur(18px);
  -webkit-backdrop-filter: saturate(160%) blur(18px);
  background-color: ${constants.colorHeaderToolbar};
  border-bottom: 1px solid ${constants.border};
  width: 100%;
  min-height: 60px !important;
  z-index: 200;

  & a {
    font-size: 0.875rem;
    color: ${constants.textColorSecondary};
  }

  & a:hover {
    color: ${constants.textColorPrimary};
  }
`;

const MenuContent = styled.div`
  background: ${constants.primarySurfaceColor};
  border-right: 1px solid ${constants.border};
  max-width: 300px;
  height: 100%;
  overflow: auto;
  min-width: 220px;
`;

const MenuLogoWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

const DrawerLink = styled(Link)`
  color: ${constants.textColorPrimary};

  & li:hover {
    background-color: rgba(255, 255, 255, 0.06);
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  span {
    font-family: ${constants.fontFamilyFuturistic};
    font-size: ${constants.fontSizeMedium};
  }
`;

const LinkGroupLink = styled(Link)`
  font-family: ${constants.fontFamilyFuturistic};
  font-size: ${constants.fontSizeMedium} !important;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 10px;
  transition: ${constants.normalTransition};

  &:hover {
    background-color: rgba(255, 255, 255, 0.07);
    opacity: 1 !important;
  }
`;

const LinkGroup = ({ navbarPages }: { navbarPages: any[] }) => (
  <VerticalAlignToolbar>
    {navbarPages.map((page: any) => (
      <TabContainer key={page.key}>
        <LinkGroupLink to={page.to}>{page.label}</LinkGroupLink>
        {Boolean(page.feature) && (
          <div
            style={{
              position: "absolute",
              textTransform: "uppercase",
              fontSize: "10px",
              top: "-10px",
              right: "0",
              color: "lightblue",
            }}
          >
            {page.feature}
          </div>
        )}
      </TabContainer>
    ))}
  </VerticalAlignToolbar>
);

const SettingsGroup = ({ children }: { children: React.ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);
  const buttonRef = useRef();

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <div>
      {/*@ts-expect-error*/}
      <IconButton
        ref={buttonRef}
        aria-label="settings menu"
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Settings />
      </IconButton>
      {buttonRef.current && (
        <DropdownMenu
          anchorEl={buttonRef.current}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{ style: { maxHeight: 600 } }}
        >
          {children}
        </DropdownMenu>
      )}
    </div>
  );
};

const MenuButtonWrapper = styled.div`
  margin-right: 12px;

  @media only screen and (min-width: 1500px) {
    display: none;
  }
`;

const LogoGroup = ({
  onMenuClick,
}: {
  onMenuClick: (e: React.MouseEvent) => void;
}) => (
  <div style={{ marginRight: 16, marginLeft: 16 }}>
    <VerticalAlignToolbar>
      <MenuButtonWrapper>
        <IconButton
          aria-label="main menu"
          edge="start"
          color="inherit"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
      </MenuButtonWrapper>
      <AppLogoWrapper>
        <AppLogo />
      </AppLogoWrapper>
    </VerticalAlignToolbar>
  </div>
);

const SearchGroup = () => (
  <VerticalAlignToolbar>
    <SearchIcon style={{ marginRight: 6, opacity: ".6" }} />
    <SearchForm />
  </VerticalAlignToolbar>
);

const SwitchPlayerLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  font-family: ${constants.fontFamilyFuturistic};
  font-size: ${constants.fontSizeMedium} !important;
  font-weight: 500;
  padding: 7px 14px;
  margin-right: 8px;
  border-radius: 999px;
  border: 1px solid ${constants.borderStrong};
  background: rgba(255, 255, 255, 0.04);
  color: ${constants.textColorPrimary} !important;

  &:hover {
    background: ${constants.gradient};
    border-color: transparent;
  }

  @media only screen and (max-width: 680px) {
    display: none;
  }
`;

const ReportBug = () => {
  const strings = useStrings();
  // Если репозиторий не задан в config.ts — ссылка вела бы на github.com//issues
  if (!config.GITHUB_REPO) {
    return null;
  }
  return (
    <DropdownMenuItem
      //@ts-expect-error
      component="a"
      href={REPORT_BUG_PATH}
      target="_blank"
      rel="noopener noreferrer"
    >
      <BugReport style={{ marginRight: 32, width: 24, height: 24 }} />
      {strings.app_report_bug}
    </DropdownMenuItem>
  );
};

const Header = ({
  location,
  disableSearch,
}: {
  location: any;
  disableSearch?: boolean;
}) => {
  const [Announce, setAnnounce] =
    useState<React.JSXElementConstructor<any> | null>(null);
  const [menuIsOpen, setMenuState] = useState(false);
  const small = useSelector((state: any) => state.browser.greaterThan.small);
  const strings = useStrings();

  useEffect(() => {
    const loadAnnounce = async () => {
      const ann = await import("../Announce/Announce");
      setAnnounce(ann.default);
    };
    void loadAnnounce();
  }, []);

  const navbarPages = [
    {
      key: "header_request",
      to: "/request",
      label: strings.header_request,
    },
    {
      key: "header_matches",
      to: "/matches",
      label: strings.header_matches,
    },
    {
      key: "header_heroes",
      to: "/heroes",
      label: strings.header_heroes,
    },
    {
      key: "header_teams",
      to: "/teams",
      label: strings.header_teams,
    },
    // {
    //   key: 'header_players',
    //   to: '/players',
    //   label: strings.header_players,
    // },
    {
      key: "header_explorer",
      to: "/explorer",
      label: strings.header_explorer,
    },
    {
      key: "header_combos",
      to: "/combos",
      label: strings.combos,
    },
    {
      key: "header_distributions",
      to: "/distributions",
      label: strings.header_distributions,
    },
    {
      key: "header_records",
      to: "/records",
      label: strings.header_records,
    },
    {
      key: "header_scenarios",
      to: "/scenarios",
      label: strings.header_scenarios,
    },
    // {
    //   key: 'header_predictions',
    //   to: '/predictions',
    //   label: 'TI Predictions',
    // },
  ];

  const drawerPages = [...navbarPages];

  return (
    <>
      <ToolbarHeader disableGutters variant="dense">
        <VerticalAlignDiv>
          <LogoGroup onMenuClick={() => setMenuState(true)} />
          {small && <LinkGroup navbarPages={navbarPages} />}
        </VerticalAlignDiv>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            gap: "4px",
          }}
        >
          <VerticalAlignDiv>
            <SwitchPlayerLink to="/">
              <SwapHorizIcon style={{ fontSize: 18 }} />
              Сменить игрока
            </SwitchPlayerLink>
          </VerticalAlignDiv>
          {!disableSearch && <SearchGroup />}
          <VerticalAlignDiv>
            <SettingsGroup>
              <LocalizationMenu />
              <ReportBug />
            </SettingsGroup>
          </VerticalAlignDiv>
        </div>
        <SwipeableDrawer
          onOpen={() => setMenuState(true)}
          onClose={() => setMenuState(false)}
          open={menuIsOpen}
        >
          <MenuContent>
            <MenuLogoWrapper>
              <div>
                <AppLogo onClick={() => setMenuState(false)} />
              </div>
            </MenuLogoWrapper>
            <List>
              {drawerPages.map((page) => (
                <DrawerLink
                  key={`drawer__${page.to}`}
                  to={page.to}
                  onClick={() => setMenuState(false)}
                >
                  <ListItem>
                    <ListItemText primary={page.label} />
                  </ListItem>
                </DrawerLink>
              ))}
            </List>
          </MenuContent>
        </SwipeableDrawer>
      </ToolbarHeader>
      {location.pathname !== "/" && Announce && <Announce />}
    </>
  );
};

export default Header;
