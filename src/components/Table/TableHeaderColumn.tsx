import React from "react";
import styled from "styled-components";
import { Tooltip } from "@mui/material";
import { StyledHeaderCell } from "./Styled";
import { getSortIcon } from "./tableHelpers";
import { getColStyle } from "../../utility";
import constants from "../constants";

const HeaderCellContent = styled.div`
  position: relative;
`;

const HeaderCellImageContent = styled.img`
  height: 24px;
  width: 24px;
`;

const HeaderCellSortIconWrapper = styled.div`
  height: 14px;
  margin-left: 0px;
  position: absolute;
  width: 10px;
  left: -5px;
  bottom: -12px;
`;

// Две стрелки: ▲ — от меньшего к большему, ▼ — от большего к меньшему
const SortButtons = styled.span`
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  margin-left: 6px;

  & button {
    all: unset;
    cursor: pointer;
    font-size: 9px;
    line-height: 10px;
    padding: 1px 4px;
    color: rgba(255, 255, 255, 0.3);
    transition: color 0.15s ease;
  }

  & button:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  & button:focus-visible {
    outline: 1px solid ${constants.textColorPrimary};
  }

  & button.active {
    color: ${constants.textColorPrimary};
  }
`;

const TableHeaderColumn = ({
  column,
  sortClick,
  sortState,
  sortField,
  index,
  setHighlightedCol,
}: {
  column: any;
  sortClick: Function;
  sortField: string;
  sortState: string;
  setHighlightedCol?: Function;
  index: number;
}) => {
  const style: React.CSSProperties = {
    justifyContent: column.center ? "center" : undefined,
    cursor: column.sortFn ? "pointer" : undefined,
  };
  const isSorted = sortField === column.field;
  const showSortButtons = Boolean(column.sortFn && column.sortIcon);
  const handleHeaderClick = () => {
    if (!column.sortFn) return;
    // initialSort: с какого направления начинать (для названий удобнее A→Я)
    sortClick(
      column.field,
      sortState,
      column.sortFn,
      !isSorted ? column.initialSort : undefined,
    );
  };
  return (
    <th
      aria-sort={
        isSorted && sortState
          ? sortState === "asc"
            ? "ascending"
            : "descending"
          : undefined
      }
      style={{
        ...getColStyle(column),
      }}
      {...(setHighlightedCol && setHighlightedCol(index))}
      className={column.className}
    >
      <StyledHeaderCell onClick={handleHeaderClick} style={style}>
        <div
          style={{
            color: column.color,
            width: "100%",
            textAlign: getColStyle(column).textAlign,
          }}
        >
          {!column.tooltip ? (
            column.displayName
          ) : (
            <Tooltip title={column.tooltip}>
              <HeaderCellContent>
                {column.displayIcon ? (
                  <React.Fragment>
                    <span> {column.displayName} </span>
                    <HeaderCellImageContent src={column.displayIcon} />
                  </React.Fragment>
                ) : (
                  <span>{column.displayName}</span>
                )}
                {column.sortFn && !column.sortIcon && (
                  <HeaderCellSortIconWrapper>
                    {getSortIcon(sortState, sortField, column.field, {
                      height: 12,
                      width: 12,
                    })}
                  </HeaderCellSortIconWrapper>
                )}
              </HeaderCellContent>
            </Tooltip>
          )}
          {showSortButtons && (
            <SortButtons>
              <button
                type="button"
                className={isSorted && sortState === "asc" ? "active" : ""}
                aria-label={`${column.displayName}: ↑`}
                title="↑"
                onClick={(e) => {
                  e.stopPropagation();
                  sortClick(column.field, sortState, column.sortFn, "asc");
                }}
              >
                ▲
              </button>
              <button
                type="button"
                className={isSorted && sortState === "desc" ? "active" : ""}
                aria-label={`${column.displayName}: ↓`}
                title="↓"
                onClick={(e) => {
                  e.stopPropagation();
                  sortClick(column.field, sortState, column.sortFn, "desc");
                }}
              >
                ▼
              </button>
            </SortButtons>
          )}
        </div>
      </StyledHeaderCell>
    </th>
  );
};

export default TableHeaderColumn;
