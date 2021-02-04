import moment, { unitOfTime } from "moment-timezone";
import { RsqlParamProps, RSQL_OPERATORS_MAP } from "../constants";

export const getRsqlParams = (params: RsqlParamProps[]) => {
  const queries = params.map(
    ({ key, value, operator = RSQL_OPERATORS_MAP.EQUAL }) =>
      `${key}${operator}${value}`
  );

  return queries.filter((o) => !!o).join(";");
};

export const getLikeRsql = (
  keys: string[],
  searched: string,
  entityName = "entityData"
) => ({
  key: entityName,
  operator: RSQL_OPERATORS_MAP.LIKE,
  value: `(${keys.join(",")},"${searched.replace(/"/g, '"').toLowerCase()}")`,
});

export const getDateIsBetweenRsql = (
  date: string,
  unitOfTime: unitOfTime.StartOf = "day"
) => ({
  key: "date",
  operator: RSQL_OPERATORS_MAP.DATE_IS_BETWEEN,
  value: `${moment(date).startOf(unitOfTime).toISOString()},${moment(date)
    .endOf(unitOfTime)
    .toISOString()}`,
});

export const getDateIsBeforeRsql = (date: string) => ({
  key: "date",
  operator: RSQL_OPERATORS_MAP.DATE_IS_BEFORE,
  value: date,
});

export const getDateIsAfterRsql = (date: string) => ({
  key: "date",
  operator: RSQL_OPERATORS_MAP.DATE_IS_AFTER,
  value: date,
});

export const getDateFieldIsBetweenRsql = (
  date: string,
  fieldCode: string,
  entityName = "entityData",
  unitOfTime: unitOfTime.StartOf = "day"
) => ({
  key: entityName,
  operator: RSQL_OPERATORS_MAP.DATE_FIELD_IS_BETWEEN,
  value: `(${fieldCode},"${moment(date)
    .startOf(unitOfTime)
    .toISOString()}","${moment(date).endOf(unitOfTime).toISOString()}")`,
});

export const getDateFieldIsBeforeRsql = (
  date: string,
  fieldCode: string,
  entityName = "entityData"
) => ({
  key: entityName,
  operator: RSQL_OPERATORS_MAP.DATE_FIELD_IS_BEFORE,
  value: `(${fieldCode},"${date}")`,
});

export const getDateFieldIsAfterRsql = (
  date: string,
  fieldCode: string,
  entityName = "entityData"
) => ({
  key: entityName,
  operator: RSQL_OPERATORS_MAP.DATE_FIELD_IS_AFTER,
  value: `(${fieldCode},"${date}")`,
});

export const getFieldEqualRsql = (
  searched: string | number,
  fieldCode: string,
  entityName = "entityData"
) => ({
  key: entityName,
  operator: RSQL_OPERATORS_MAP.FIELD_EQUAL,
  value: `(${fieldCode},"${searched}")`,
});

export const getEqualRsql = (key: string, value: string) => ({
  key,
  value,
});