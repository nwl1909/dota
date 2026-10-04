import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import constants from "../constants";
import useStrings from "../../hooks/useStrings.hook";

// Служебные слова (английские и русские), которые забивают облако.
// Set вместо RegExp: слова из чата могут содержать спецсимволы.
const STOP_WORDS = new Set(
  (
    "a,am,an,and,are,as,at,be,by,for,from,how,i,im,in,is,it,not,of,on,or,that,the,this,to,was,what,when,where,who,will,with,you,u,so,do,my,me,we,he,she,they,but,if,no,yes," +
    "и,в,во,не,что,он,на,я,с,со,как,а,то,все,она,так,его,но,да,ты,к,у,же,вы,за,бы,по,только,ее,мне,было,вот,от,меня,еще,нет,о,из,ему,теперь,когда,даже,ну,вдруг,ли,если,уже,или,ни,быть,был,него,до,вас,нибудь,опять,уж,вам,ведь,там,потом,себя,ничего,ей,может,они,тут,где,есть,надо,ней,для,мы,тебя,их,чем,была,сам,чтоб,без,будто,чего,раз,тоже,себе,под,будет,ж,тогда,кто,этот,того,потому,этого,какой,совсем,ним,здесь,этом,один,почти,мой,тем,чтобы,нее,сейчас,были,куда,зачем,всех,никогда,можно,при,наконец,два,об,другой,хоть,после,над,больше,тот,через,эти,нас,про,них,какая,много,разве,три,эту,моя,впрочем,хорошо,свою,этой,перед,иногда,лучше,чуть,том,нельзя,такой,им,более,всегда,конечно,всю,между"
  ).split(","),
);

const MAX_FONT = 44;
const MIN_FONT = 13;

const TOP_OPTIONS = [30, 60, 100] as const;

type View = "cloud" | "list";

const Wrapper = styled.div`
  width: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  margin-bottom: 14px;

  & .MuiToggleButton-root {
    text-transform: none;
    padding: 4px 12px;
    font-size: ${constants.fontSizeSmall};
  }
`;

const Summary = styled.div`
  color: ${constants.colorMutedLight};
  font-size: ${constants.fontSizeSmall};
  margin-bottom: 14px;

  & b {
    color: ${constants.textColorPrimary};
    font-weight: 500;
  }
`;

const Cloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px 14px;
  padding: 20px 12px;
  border: 1px solid ${constants.border};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  line-height: 1.15;

  @media only screen and (max-width: 680px) {
    gap: 4px 10px;
    padding: 14px 8px;
  }
`;

const Word = styled.span`
  cursor: default;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:hover {
    transform: scale(1.12);
  }
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${constants.border};
  border-radius: 12px;
  overflow: hidden;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 32px minmax(80px, 200px) 1fr 70px 56px;
  align-items: center;
  gap: 12px;
  padding: 7px 14px;
  font-size: ${constants.fontSizeMedium};

  &:nth-child(odd) {
    background: rgba(255, 255, 255, 0.025);
  }

  & .rank {
    color: ${constants.colorMutedLight};
    text-align: right;
    font-size: ${constants.fontSizeSmall};
  }

  & .word {
    color: ${constants.textColorPrimary};
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .bar {
    height: 6px;
    border-radius: 3px;
    background: ${constants.colorMuted};
    overflow: hidden;
  }

  & .bar > div {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, #8b7bff, #22d3ee);
  }

  & .count {
    text-align: right;
    color: ${constants.textColorPrimary};
    font-variant-numeric: tabular-nums;
  }

  & .percent {
    text-align: right;
    color: ${constants.colorMutedLight};
    font-size: ${constants.fontSizeSmall};
    font-variant-numeric: tabular-nums;
  }

  @media only screen and (max-width: 680px) {
    grid-template-columns: 24px minmax(60px, 1fr) 56px 48px;
    gap: 8px;
    padding: 7px 10px;

    & .bar {
      display: none;
    }
  }
`;

const Empty = styled.div`
  padding: 28px 12px;
  text-align: center;
  color: ${constants.colorMutedLight};
  border: 1px dashed ${constants.border};
  border-radius: 12px;
`;

const numberFormat = (n: number) => n.toLocaleString();

// Цвет по месту в рейтинге: топ-10% — яркие, дальше приглушённее
const colorByRank = (rank: number, total: number) => {
  const share = rank / Math.max(total, 1);
  if (share < 0.1) return "#22d3ee";
  if (share < 0.3) return "#8b7bff";
  if (share < 0.6) return constants.textColorPrimary;
  return constants.secondaryTextColor;
};

// Самые частые слова ставим в середину, остальные — по краям
const centerBiggest = <T,>(sortedDesc: T[]): T[] => {
  const out: T[] = [];
  sortedDesc.forEach((item, i) => {
    if (i % 2) out.push(item);
    else out.unshift(item);
  });
  return out;
};

type WordcloudProps = { counts?: Record<string, number> };

const Wordcloud = ({ counts }: WordcloudProps) => {
  const strings = useStrings();
  const [view, setView] = useState<View>("cloud");
  const [top, setTop] = useState<number>(60);
  const [query, setQuery] = useState("");
  const [hideCommon, setHideCommon] = useState(true);

  const { all, totalWords, uniqueWords } = useMemo(() => {
    const entries: [string, number][] = Object.entries(counts || {})
      .map(([word, count]) => [word.trim(), Number(count)] as [string, number])
      .filter(([word, count]) => word && Number.isFinite(count) && count > 0);
    return {
      all: entries,
      totalWords: entries.reduce((acc, [, count]) => acc + count, 0),
      uniqueWords: entries.length,
    };
  }, [counts]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter(([word]) => !(hideCommon && STOP_WORDS.has(word.toLowerCase())))
      .filter(([word]) => !q || word.toLowerCase().includes(q))
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, top);
  }, [all, query, hideCommon, top]);

  const max = shown.length ? shown[0][1] : 0;
  const min = shown.length ? shown[shown.length - 1][1] : 0;

  const fontSize = (count: number) => {
    if (max === min) return (MAX_FONT + MIN_FONT) / 2;
    const t = (Math.log(count) - Math.log(min)) / (Math.log(max) - Math.log(min));
    return Math.round(MIN_FONT + t * (MAX_FONT - MIN_FONT));
  };

  const percent = (count: number) =>
    totalWords ? ((count / totalWords) * 100).toFixed(1) : "0";

  return (
    <Wrapper>
      <Toolbar>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_e, v: View | null) => v && setView(v)}
          aria-label="view"
        >
          <ToggleButton value="cloud">{strings.wordcloud_view_cloud}</ToggleButton>
          <ToggleButton value="list">{strings.wordcloud_view_list}</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={top}
          onChange={(_e, v: number | null) => v && setTop(v)}
          aria-label="top"
        >
          {TOP_OPTIONS.map((n) => (
            <ToggleButton key={n} value={n}>
              {strings.wordcloud_top} {n}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <ToggleButton
          size="small"
          value="common"
          selected={hideCommon}
          onChange={() => setHideCommon((v) => !v)}
        >
          {strings.wordcloud_hide_common}
        </ToggleButton>

        <TextField
          size="small"
          placeholder={strings.wordcloud_search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{ "aria-label": strings.wordcloud_search }}
          style={{ minWidth: 180 }}
        />
      </Toolbar>

      <Summary>
        {strings.wordcloud_total_words}: <b>{numberFormat(totalWords)}</b>
        {" · "}
        {strings.wordcloud_unique_words}: <b>{numberFormat(uniqueWords)}</b>
        {" · "}
        {strings.wordcloud_shown}: <b>{numberFormat(shown.length)}</b>
      </Summary>

      {shown.length === 0 && <Empty>{strings.wordcloud_empty}</Empty>}

      {shown.length > 0 && view === "cloud" && (
        <Cloud>
          {centerBiggest(shown).map(([word, count]) => {
            const rank = shown.findIndex(([w]) => w === word);
            return (
              <Word
                key={word}
                title={`${word} — ${numberFormat(count)} ${strings.wordcloud_times} (${percent(count)}%)`}
                style={{
                  fontSize: fontSize(count),
                  color: colorByRank(rank, shown.length),
                }}
              >
                {word}
              </Word>
            );
          })}
        </Cloud>
      )}

      {shown.length > 0 && view === "list" && (
        <List>
          {shown.map(([word, count], i) => (
            <Row key={word}>
              <span className="rank">{i + 1}</span>
              <span className="word" title={word}>
                {word}
              </span>
              <span className="bar">
                <div style={{ width: `${(count / max) * 100}%` }} />
              </span>
              <span className="count">{numberFormat(count)}</span>
              <span className="percent">{percent(count)}%</span>
            </Row>
          ))}
        </List>
      )}
    </Wrapper>
  );
};

export default Wordcloud;
