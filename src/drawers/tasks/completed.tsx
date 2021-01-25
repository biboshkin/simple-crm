import React, { useState } from "react";
import axios from "axios";
import { DrawerForm } from "../../components";
import { useTranslation } from "react-i18next";
import { Store } from "antd/lib/form/interface";
import {
  urls,
  FieldProps,
  TASK_STATUSES,
  FORM_NAMES,
  PERMISSIONS_SET,
} from "../../constants";
import {
  defaultErrorHandler,
  defaultSuccessHandler,
  getFullUrl,
  useFormValues,
} from "../../utils";
import { isEmpty } from "lodash";

interface CompleteTaskProps {
  fields: FieldProps[];
  visible: boolean;
  onClose: (event: any, entity?: Store) => void;
}

export const CompleteTask = ({
  fields,
  visible,
  onClose,
}: CompleteTaskProps) => {
  const [t] = useTranslation("tasksDrawer");
  const [loading, setLoading] = useState(false);
  const metaCompletedInfo = {
    taskStatus: TASK_STATUSES.COMPLETED,
  };
  const { values } = useFormValues(FORM_NAMES.TASK_COMPLETED);

  const onFinish = async (data: Store) => {
    setLoading(true);
    try {
      const url = getFullUrl(urls.tasks.entity, values.id);
      const responce = await axios.put(url, { ...data, ...metaCompletedInfo });
      defaultSuccessHandler(t("message.success.completed"));
      onClose(void 0, responce?.data);
    } catch (error) {
      defaultErrorHandler({ error, defaultErrorMessage: t("message.error") });
    } finally {
      setLoading(false);
    }
  };

  if (isEmpty(values)) {
    return null;
  }

  return (
    <DrawerForm
      title={t("title.completed")}
      fields={fields}
      name={FORM_NAMES.TASK_COMPLETED}
      onClose={onClose}
      visible={visible}
      submitLoading={loading}
      onFinish={onFinish}
      defaultSubmitDisabled={false}
    />
  );
};

export default CompleteTask;
