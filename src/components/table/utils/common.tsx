import React from "react";
import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";
import { Dispatch } from "@reduxjs/toolkit";
import { columns as tableColumns } from "../components";

import {
  ActionProps,
  ColumnProps,
  EntityOwnerProps,
  LinksType,
  RecordType,
} from "../../../constants";
import { getSorterProp } from "./sorter";
import { getEditableProp } from "./editable";
import { renderActions } from "./actions";
import { getColumnSearchProp } from "./column-search";
import { fetchDictionary } from "./fetch";

const getRenderProp = (column: ColumnProps) => ({
  render: (text: string, record: any) => {
    const { Entity, Date, Text, Number, Dictionary } = tableColumns;
    const { format, columnType } = column;

    switch (columnType) {
      case "entity":
        return <Entity value={text} column={column} />;
      case "dictionary":
        return <Dictionary value={text} column={column} />;
      case "date":
        return (
          <Date value={text} format={format} record={record} column={column} />
        );
      case "number":
        return (
          <Number
            value={text}
            format={format}
            record={record}
            column={column}
          />
        );
      default:
        return (
          <Text value={text} format={format} record={record} column={column} />
        );
    }
  },
});

export const getColumn = (
  column: ColumnProps,
  searchedColumns: RecordType,
  permissions: string[] = []
) => {
  const { columnCode, columnName, fixed, ellipsis, width } = column;

  return {
    key: columnCode,
    title: columnName,
    dataIndex: columnCode,
    fixed,
    width,
    ellipsis,
    ...getSorterProp(column),
    ...getEditableProp(column, permissions),
    ...getColumnSearchProp(column, searchedColumns),
    ...getRenderProp(column),
  };
};

export const getFilteredDataSource = (
  searched: string,
  dataSource: any[],
  columns?: ColumnProps[],
  idField: string = "id"
) => {
  const visibleColumns = dataSource.map((item) => {
    const picked = columns?.map((col) => col.columnCode) ?? [];
    return pick(item, [...picked, idField]);
  });

  const filteredIds = visibleColumns
    .filter((row: Object) =>
      Object.values(row).some((value: string) =>
        value?.toString()?.toLowerCase()?.includes(searched?.toLowerCase())
      )
    )
    .map((o) => o?.[idField]);

  return dataSource.filter((o) => filteredIds.includes(o?.[idField]));
};

export const getActions = (
  actions: ActionProps[] = [],
  t: (value: string) => string
): any => {
  if (isEmpty(actions)) {
    return [];
  }

  return [
    {
      title: t("actions.column.title"),
      key: "actions",
      render: (text: string, entity: EntityOwnerProps) =>
        renderActions(actions, text, entity),
    },
  ];
};

export const getDataColumns = (
  columns: ColumnProps[] = [],
  searchedColumns: RecordType,
  permissions?: string[]
) =>
  columns.map((column) => {
    const columnProps = getColumn(column, searchedColumns, permissions);

    if (!isEmpty(column.columnActions)) {
      const actions = column.columnActions || [];
      return {
        ...columnProps,
        render: (text: string, entity: EntityOwnerProps) =>
          renderActions(actions, text, entity, column),
      };
    }

    return columnProps;
  });

export const loadDictionaries = (
  columns: ColumnProps[],
  links: LinksType,
  dispatch: Dispatch
) => {
  if (!isEmpty(links)) {
    const linksKeys = Object.keys(links);
    const visibleColumns = columns.map(({ columnCode }) => columnCode);

    linksKeys
      .filter((key) => visibleColumns.includes(key))
      .forEach((dictionaryName) =>
        fetchDictionary(links?.[dictionaryName]?.href, dictionaryName, dispatch)
      );
  }
};
