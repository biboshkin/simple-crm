import React from "react";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";

import { urls, http } from ".";
import { logo } from "../assets/img";
import { PERMISSIONS } from "./permissions";

const { CLIENTS, TASKS } = PERMISSIONS;

export const LOGO = logo;

export const MENU_ITEMS = [
  {
    id: "clients",
    title: "Клиенты",
    url: http.MAIN_PAGE_URL,
    permissions: [CLIENTS.ADMIN, CLIENTS.GET, CLIENTS.GET_OWNER],
    icon: <UserOutlined />,
  },
  {
    id: "tasks",
    title: "Задачи",
    url: urls.tasks.path,
    permissions: [TASKS.ADMIN, TASKS.GET, TASKS.GET_OWNER],
    icon: <CalendarOutlined />,
  },
];

export const BREADCRUMB_ROUTES = {
  CLIENTS: [
    {
      path: http.MAIN_PAGE_URL,
      breadcrumbName: "Главная",
    },
    {
      path: urls.clients.path,
      breadcrumbName: "Клиенты",
    },
  ],
  TASKS: [
    {
      path: http.MAIN_PAGE_URL,
      breadcrumbName: "Главная",
    },
    {
      path: urls.tasks.path,
      breadcrumbName: "Задачи",
    },
  ],
};
