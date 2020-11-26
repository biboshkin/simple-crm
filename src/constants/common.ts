export const DATE_FORMATS = {
  DATE: "DD.MM.YYYY",
  DATE_TIME: "DD.MM.YYYY HH:mm",
  TIME: "HH:mm",
};

export const DEFAULT_FIELD_SPAN = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
export const GUTTER_FULL_WIDTH = {
  HORIZONTAL: 48,
  VERTICAL: 16,
};

export const CLIENT_NEW_ID = "new";

export const RSQL_OPERATORS_MAP = {
  LIKE: "=JLIKE=",
  EQUAL: "==",
  FIELD_EQUAL: "=JEQ=",
};

export const TASK_STATUSES = {
  COMPLETED: "COMPLETED",
  NOT_COMPLETED: "NOT_COMPLETED",
};

export const TASK_TYPES = {
  CALL: "CALL",
};

export const TASK_TYPES_MAP = {
  CALL: "Звонок",
};

export const FORM_NAMES = {
  CLIENT_CARD: "clientCard",
  CONTACT_VIEW: "contactView",
  CONTACT_ADD: "contactAdd",
  TASK_ADD: "taskAdd",
  TASK_COMPLETED: "taskCompleted",
  TASK_VIEW: "taskView",
};

export const BASE_PHONE_MASK = [
  "+",
  "7",
  " ",
  "(",
  /[1-9]/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

export const FULL_PHONE_MASK = [...BASE_PHONE_MASK, ",", " ", /\d/, /\d/, /\d/];
