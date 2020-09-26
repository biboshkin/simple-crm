const { clients } = require("./urls");

const HTTP_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ROOT_URL = "/crm";
const MAIN_PAGE_URL = clients.path;

const ERROR_SCREEN_CODES = [
  HTTP_CODES.FORBIDDEN,
  HTTP_CODES.SERVER_ERROR,
  HTTP_CODES.NOT_FOUND,
];

const COOKIES = {
  JSESSIONID: "JSESSIONID",
  USERNAME: "username",
  REMEMBER_ME: "rememberMe",
};

module.exports = {
  COOKIES,
  ERROR_SCREEN_CODES,
  HTTP_CODES,
  ROOT_URL,
  MAIN_PAGE_URL,
};
