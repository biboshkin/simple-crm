import { PERMISSIONS, PERMISSIONS_SET } from "../permissions";
import { DATE_FORMATS } from "../common";
import { urls, DrawerProps } from "..";

const REQUIRED_MESSAGE = "Пожалуйста, заполните поле";
const PLACEHOLDER_DEFAULT = "Введите значение";

interface TasksConfigProps {
  drawers: DrawerProps[];
}

export const TASKS: TasksConfigProps = {
  drawers: [
    {
      code: "task",
      name: "Задача",
      description: "Форма для просмотра и добавления задачи",
      fields: [
        {
          fieldCode: "clientId",
          fieldName: "Компания",
          fieldDescription: "Компания связанная с задачей",
          type: "entity-personal",
          titleField: "shortName",
          codeField: "id",
          readonly: false,
          disabled: false,
          span: { xl: 24, md: 24, lg: 24, sm: 24 },
          rules: [{ required: true, message: REQUIRED_MESSAGE }],
          permissions: [],
          _links: {
            self: {
              href: urls.clients.entity,
            },
          },
        },
        {
          fieldCode: "taskEndDate",
          fieldName: "Дата и время",
          fieldDescription: "",
          type: "date",
          format: DATE_FORMATS.DATE_TIME,
          readonly: false,
          disabled: false,
          span: { xl: 24, md: 24, lg: 24, sm: 24 },
          placeholder: PLACEHOLDER_DEFAULT,
          rules: [{ required: true, message: REQUIRED_MESSAGE }],
          permissions: [],
        },
        {
          fieldCode: "taskDescription",
          fieldName: "Описание",
          fieldDescription: "",
          type: "string",
          format: "textarea",
          readonly: false,
          disabled: false,
          span: { xl: 24, md: 24, lg: 24, sm: 24 },
          placeholder: PLACEHOLDER_DEFAULT,
          rules: [
            { max: 2000, message: "Превышена максимальная длина строки" },
          ],
          permissions: [],
        },
      ],
    },
    {
      code: "taskCompleted",
      name: "Выполнить задачу",
      description: "Форма для ввода комментария после выполнения задачи",
      fields: [
        {
          fieldCode: "note",
          fieldName: "Комментарий",
          fieldDescription: "",
          type: "string",
          format: "textarea",
          readonly: false,
          disabled: false,
          span: { xl: 24, md: 24, lg: 24, sm: 24 },
          placeholder: "Введите комментарий по выполненной задаче",
          rules: [
            { max: 2000, message: "Превышена максимальная длина строки" },
          ],
          permissions: [],
        },
      ],
    },
  ],
};
