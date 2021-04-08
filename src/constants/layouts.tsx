import React from "react";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";

import { urls, http } from ".";
import { logo } from "../assets/img";
import { PERMISSIONS_SET } from "./permissions";

export const LOGO = logo;

export const MENU_ITEMS = [
  {
    id: "clients",
    title: "Клиенты",
    url: urls.clients.path,
    permissions: PERMISSIONS_SET.CLIENT_GET,
    icon: <UserOutlined />,
  },
  {
    id: "tasks",
    title: "Задачи",
    url: urls.tasks.path,
    permissions: PERMISSIONS_SET.TASK_GET,
    icon: <CalendarOutlined />,
  },
];

export const BREADCRUMB_ROUTES = {
  PROFILE: [
    {
      path: urls.main.path,
      breadcrumbName: "Главная",
    },
    {
      path: urls.profile.path.replace(urls.main.path, ""),
      breadcrumbName: "Профиль",
    },
  ],
  CLIENTS: [
    {
      path: urls.main.path,
      breadcrumbName: "Главная",
    },
    {
      path: urls.clients.path.replace(urls.main.path, ""),
      breadcrumbName: "Клиенты",
    },
  ],
  TASKS: [
    {
      path: urls.main.path,
      breadcrumbName: "Главная",
    },
    {
      path: urls.tasks.path.replace(urls.main.path, ""),
      breadcrumbName: "Задачи",
    },
  ],
};
