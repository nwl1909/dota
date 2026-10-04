import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch } from "react-redux";
import config from "../../config";
import { fetchJson } from "../../apiCache";
import {
  getPlayer,
  getPlayerWinLoss,
  getPlayerRecentMatches,
  getPlayerHeroes,
  getPlayerPeers,
  getPlayerCounts,
} from "../../actions";
import constants from "../constants";
import {
  FAVORITE_PLAYERS,
  FavoritePlayer,
  RANK_NAMES,
  getSelectedPlayer,
  setSelectedPlayer,
} from "../../players";

type Profile = {
  loading: boolean;
  error?: boolean;
  persona?: string;
  avatar?: string;
  rankTier?: number | null;
  win?: number;
  lose?: number;
};

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-top: 40px;

  @media only screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media only screen and (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Card = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border-radius: ${constants.radiusLg};
  border: 1px solid ${constants.border};
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.02)
  );
  color: ${constants.textColorPrimary} !important;
  overflow: hidden;
  opacity: 0;
  animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition:
    transform 250ms ease,
    border-color 250ms ease,
    box-shadow 250ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      320px 160px at 100% 0%,
      rgba(139, 123, 255, 0.22),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 250ms ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(139, 123, 255, 0.55);
    box-shadow: 0 18px 40px -16px rgba(139, 123, 255, 0.5);
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 18px;
  background: ${constants.gradient};
  padding: 2px;

  & img,
  & div {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    object-fit: cover;
    background: ${constants.primarySurfaceColor};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${constants.fontFamilyFuturistic};
    font-size: 26px;
    font-weight: 700;
  }
`;

const Names = styled.div`
  min-width: 0;

  & .name {
    font-family: ${constants.fontFamilyFuturistic};
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .persona {
    margin-top: 2px;
    font-size: 0.8rem;
    color: ${constants.textColorSecondary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 44px;

  & .rank {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: ${constants.textColorSecondary};
  }

  & .rank img {
    width: 40px;
    height: 40px;
  }

  & .wl {
    text-align: right;
    font-size: 0.8rem;
    color: ${constants.textColorSecondary};
  }

  & .wl b {
    display: block;
    font-family: ${constants.fontFamilyFuturistic};
    font-size: 1.25rem;
    color: ${constants.textColorPrimary};
  }
`;

const Bar = styled.div`
  height: 6px;
  border-radius: 6px;
  background: rgba(248, 113, 113, 0.5);
  overflow: hidden;

  & > div {
    height: 100%;
    background: ${constants.colorGreen};
    border-radius: 6px;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${constants.textColorSecondary};
  font-variant-numeric: tabular-nums;

  & .go {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${constants.primaryLinkColor};
    font-weight: 500;
  }
`;

const Skeleton = styled.span`
  display: inline-block;
  width: 90px;
  height: 14px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
`;

const Continue = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 28px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid ${constants.borderStrong};
  background: rgba(255, 255, 255, 0.05);
  color: ${constants.textColorPrimary} !important;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  & b {
    font-family: ${constants.fontFamilyFuturistic};
  }
`;

const CustomForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 520px;
  margin: 44px auto 0;
  padding: 6px 6px 6px 18px;
  border-radius: 999px;
  border: 1px solid ${constants.border};
  background: rgba(255, 255, 255, 0.04);
  transition: border-color 200ms ease, box-shadow 200ms ease;

  &:focus-within {
    border-color: rgba(139, 123, 255, 0.6);
    box-shadow: 0 0 0 4px rgba(139, 123, 255, 0.15);
  }

  & input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    outline: 0;
    color: ${constants.textColorPrimary};
    font-family: inherit;
    font-size: 0.95rem;
  }

  & input::placeholder {
    color: ${constants.textColorSecondary};
  }

  & button {
    border: 0;
    cursor: pointer;
    padding: 9px 18px;
    border-radius: 999px;
    background: ${constants.gradient};
    color: #fff;
    font-family: ${constants.fontFamilyFuturistic};
    font-weight: 600;
    font-size: 0.85rem;
  }
`;

const Hint = styled.div`
  margin-top: 12px;
  text-align: center;
  font-size: 0.8rem;
  color: ${constants.textColorSecondary};
`;

const useProfiles = (players: FavoritePlayer[]) => {
  const [profiles, setProfiles] = useState<Record<number, Profile>>(() =>
    Object.fromEntries(players.map((p) => [p.accountId, { loading: true }])),
  );

  useEffect(() => {
    let cancelled = false;
    players.forEach(async (player) => {
      const base = `${config.VITE_API_HOST}/api/players/${player.accountId}`;
      try {
        const [profile, wl] = await Promise.all([
          fetchJson(base),
          fetchJson(`${base}/wl`),
        ]);
        if (cancelled) return;
        setProfiles((prev) => ({
          ...prev,
          [player.accountId]: {
            loading: false,
            persona: profile?.profile?.personaname,
            avatar: profile?.profile?.avatarfull,
            rankTier: profile?.rank_tier,
            win: wl?.win,
            lose: wl?.lose,
          },
        }));
      } catch (e) {
        if (cancelled) return;
        setProfiles((prev) => ({
          ...prev,
          [player.accountId]: { loading: false, error: true },
        }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [players]);

  return profiles;
};

// Заранее грузим данные игрока при наведении — к клику они уже в кэше
const prefetched = new Set<number>();

const PlayerCard = ({
  player,
  profile,
  index,
}: {
  player: FavoritePlayer;
  profile: Profile;
  index: number;
}) => {
  const dispatch = useDispatch();
  const prefetch = () => {
    if (prefetched.has(player.accountId)) return;
    prefetched.add(player.accountId);
    const id = String(player.accountId);
    [
      getPlayer(id),
      getPlayerWinLoss(id, ""),
      getPlayerRecentMatches(id, ""),
      getPlayerHeroes(id, ""),
      getPlayerPeers(id, ""),
      getPlayerCounts(id, ""),
    ].forEach((thunk) => {
      try {
        Promise.resolve((dispatch as any)(thunk)).catch(() => {});
      } catch (e) {
        // игнорируем — это только предзагрузка
      }
    });
  };
  const total = (profile.win || 0) + (profile.lose || 0);
  const winrate = total ? (100 * (profile.win || 0)) / total : 0;
  const tier = profile.rankTier ? Math.floor(profile.rankTier / 10) : 0;

  return (
    <Card
      to={`/players/${player.accountId}`}
      onClick={() => setSelectedPlayer(player.accountId)}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <CardTop>
        <Avatar>
          {profile.avatar ? (
            <img src={profile.avatar} alt={player.name} />
          ) : (
            <div>{player.name.charAt(0)}</div>
          )}
        </Avatar>
        <Names>
          <div className="name">{player.name}</div>
          <div className="persona">
            {profile.loading ? <Skeleton /> : profile.persona || "—"}
          </div>
        </Names>
      </CardTop>

      <Stats>
        <div className="rank">
          {tier > 0 ? (
            <>
              <img
                src={`/assets/images/dota2/rank_icons/rank_icon_${tier}.png`}
                alt={RANK_NAMES[tier]}
              />
              {RANK_NAMES[tier]}
            </>
          ) : (
            <span>{profile.loading ? "" : RANK_NAMES[0]}</span>
          )}
        </div>
        <div className="wl">
          {profile.loading ? (
            <Skeleton />
          ) : total ? (
            <>
              <b>{winrate.toFixed(1)}%</b>
              винрейт
            </>
          ) : (
            <span>{profile.error ? "нет данных" : "скрыт"}</span>
          )}
        </div>
      </Stats>

      <div>
        <Bar>
          <div style={{ width: `${winrate}%` }} />
        </Bar>
      </div>

      <CardFooter>
        <span>
          {total ? `${profile.win} W · ${profile.lose} L` : `ID ${player.accountId}`}
        </span>
        <span className="go">
          Открыть <ArrowForwardIcon style={{ fontSize: 14 }} />
        </span>
      </CardFooter>
    </Card>
  );
};

const PlayerPicker = () => {
  const history = useHistory();
  const profiles = useProfiles(FAVORITE_PLAYERS);
  const [query, setQuery] = useState("");
  const [last, setLast] = useState<FavoritePlayer | null>(null);

  useEffect(() => {
    setLast(getSelectedPlayer());
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;
    if (/^\d+$/.test(value)) {
      history.push(`/players/${value}`);
    } else {
      history.push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <>
      {last && (
        <Continue to={`/players/${last.accountId}`}>
          Продолжить как <b>{last.name}</b>
          <ArrowForwardIcon style={{ fontSize: 16 }} />
        </Continue>
      )}
      <Grid>
        {FAVORITE_PLAYERS.map((player, i) => (
          <PlayerCard
            key={player.accountId}
            player={player}
            profile={profiles[player.accountId] || { loading: true }}
            index={i}
          />
        ))}
      </Grid>
      <CustomForm onSubmit={submit}>
        <SearchIcon style={{ opacity: 0.6 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Другой игрок: ID или ник"
          aria-label="Другой игрок: ID или ник"
        />
        <button type="submit">Найти</button>
      </CustomForm>
      <Hint>Статистика берётся из OpenDota по Dota 2 ID</Hint>
    </>
  );
};

export default PlayerPicker;
