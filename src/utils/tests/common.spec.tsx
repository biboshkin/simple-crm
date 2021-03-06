import Cookies from "js-cookie";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { checkAuthCookie, logout } from "..";
import { COOKIES } from "../../constants/http";
import { DATE_FORMATS, urls } from "../../constants";
import {
  callTel,
  fillLinks,
  fillTemplate,
  getDateWithTimezone,
  getFullUrl,
  pluralize,
  getHierarchyParentId,
  encodeURIChars,
} from "../common";

const mock = new MockAdapter(axios);

const getAction = (type: string, payload?: any) => ({
  type,
  payload,
});

test("checkAuthCookie", () => {
  expect(checkAuthCookie()).toBe(false);

  Cookies.set(COOKIES.USERNAME, "asd");
  expect(checkAuthCookie()).toBe(false);

  Cookies.set(COOKIES.JSESSIONID, "123");
  expect(checkAuthCookie()).toBe(true);
});

test("logout", async () => {
  const getSpy = jest.spyOn(axios, "get");
  const dispatchSpy = jest.fn();
  mock.onGet(urls.login.logout).reply(200, {});

  await logout(dispatchSpy);
  expect(getSpy).toHaveBeenCalledWith(urls.login.logout);

  expect(dispatchSpy).toHaveBeenNthCalledWith(1, getAction("persist/logout"));
});

test("fillTemplate", () => {
  const template = "Имеем {{count}} трубы и {{color}} зубы";

  expect(fillTemplate(template, { count: 3, color: "желтые" })).toBe(
    "Имеем 3 трубы и желтые зубы"
  );

  expect(
    fillTemplate(template, { count: 3, color: "желтые", left: "asd" })
  ).toBe("Имеем 3 трубы и желтые зубы");
});

test("getFullUrl", () => {
  expect(getFullUrl("/users", "name1")).toBe("/users/name1");
  expect(getFullUrl("/users")).toBe("/users");
});

test("callTel", () => {
  const assignSpy = jest.spyOn(window.location, "assign");
  const phone = "+7 (888) 999-66-55";
  const phoneWithCode = "+7 (888) 999-66-55, 2211";

  callTel(phone);
  callTel(phoneWithCode);

  expect(assignSpy).toHaveBeenNthCalledWith(1, "tel:+78889996655");
  expect(assignSpy).toHaveBeenNthCalledWith(2, "tel:+78889996655,2211");
});

test("getDateWithTimezone", () => {
  const dateWithoutTimezone = "2021-02-04T23:00:19.172";
  expect(
    getDateWithTimezone(dateWithoutTimezone).format(DATE_FORMATS.DATE_TIME)
  ).toBe("05.02.2021 02:00");
});

test("pluralize", () => {
  const one = "арбуз";
  const some = "арбуза";
  const many = "арбузов";
  const vars = [one, some, many];

  expect(pluralize(1, vars)).toBe(one);
  expect(pluralize(101, vars)).toBe(one);
  expect(pluralize(2, vars)).toBe(some);
  expect(pluralize(102, vars)).toBe(some);
  expect(pluralize(10, vars)).toBe(many);
  expect(pluralize(100, vars)).toBe(many);
});

test("fillLinks", () => {
  const links = {
    self: {
      href: "/somePath/id",
    },
    userNames: {
      href: "/somePath/id/{{name}}",
    },
    profiles: {
      href: "/somePath/id/{{profile}}",
    },
  };

  expect(fillLinks(links, { name: "Ivan", profile: "user" })).toEqual({
    self: {
      href: "/somePath/id",
    },
    userNames: {
      href: "/somePath/id/Ivan",
    },
    profiles: {
      href: "/somePath/id/user",
    },
  });
});

test("fillLinks without value", () => {
  const links = {
    self: {
      href: "/somePath/id",
    },
    userNames: {
      href: "/somePath/id/{{name}}",
    },
    profiles: {
      href: "/somePath/id/{{profile}}",
    },
  };

  expect(fillLinks(links, { profile: "user" })).toEqual({
    self: {
      href: "/somePath/id",
    },
    userNames: {
      href: "/somePath/id/{{name}}",
    },
    profiles: {
      href: "/somePath/id/user",
    },
  });
});

test("getHierarchyParentId", () => {
  const hierarchy = "1.2.3";

  expect(getHierarchyParentId(hierarchy)).toBe("3");
});

test("encodeURIChars plus", () => {
  const urlWithPlus = "/gogogo?+123";

  expect(encodeURIChars(urlWithPlus)).toBe("/gogogo?%2B123");
});

test("encodeURIChars space", () => {
  const urlWithPlus = "/gogogo? 123";

  expect(encodeURIChars(urlWithPlus)).toBe("/gogogo?%20123");
});
