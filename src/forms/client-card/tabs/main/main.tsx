import React, { useCallback, useMemo, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Row, Form, Spin } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Store } from "antd/lib/form/interface";
import { useTranslation } from "react-i18next";
import { FormFooter } from "../../../../components";
import {
  createFormField,
  isValuesChanged,
  defaultErrorHandler,
  defaultSuccessHandler,
  getFullUrl,
  useFormValues,
  FormContext,
} from "../../../../utils";
import { ComponentPermissionsChecker } from "../../../../wrappers";
import {
  GUTTER_FULL_WIDTH,
  urls,
  QueryProps,
  FORM_NAMES,
  State,
  ProfileInfoEntityProps,
  ClientEntityProps,
  TabPaneFormProps,
  CLIENT_NEW_ID,
} from "../../../../constants";
import { getAddMetaValues } from "../../utils";

interface MainProps extends TabPaneFormProps {
  profileInfo: ProfileInfoEntityProps;
  formLoading: boolean;
}

export const Main: React.FC<MainProps> = ({
  tab,
  profileInfo,
  formLoading,
}) => {
  const { id } = useParams<QueryProps>();
  const [form] = Form.useForm();
  const history = useHistory();
  const [t] = useTranslation("clientCardMain");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { values: formValues, update } = useFormValues<ClientEntityProps>(
    FORM_NAMES.CLIENT_CARD
  );

  const isAdd = useMemo(() => id === CLIENT_NEW_ID, [id]);
  const initialValues = isAdd ? getAddMetaValues(profileInfo) : formValues;

  const handleValuesChange = (changed: Object, allValues: Object) => {
    const isChanged = isValuesChanged(initialValues, allValues);
    setSubmitDisabled(!isChanged);
  };

  const handleGoBack = useCallback(() => {
    history.go(-1);
  }, [history]);

  const onFinishAdd = async (values: Store) => {
    setSubmitLoading(true);
    const url = urls.clients.entity;
    try {
      const response: AxiosResponse<ClientEntityProps> = await axios.post(url, {
        ...initialValues,
        ...values,
      });

      update(response?.data ?? {});
      form.setFieldsValue(response?.data ?? {});

      defaultSuccessHandler(t("message.success"));
      history.replace(getFullUrl(urls.clients.path, response?.data?.id));
      setSubmitDisabled(true);
    } catch (error) {
      defaultErrorHandler({ error });
    } finally {
      setSubmitLoading(false);
    }
  };

  const onFinishEdit = async (values: Store) => {
    setSubmitLoading(true);
    const url = getFullUrl(urls.clientCard.entity, id);
    try {
      const response: AxiosResponse<ClientEntityProps> = await axios.put(url, {
        ...initialValues,
        ...values,
      });

      update(response?.data ?? {});
      form.setFieldsValue(response?.data ?? {});

      defaultSuccessHandler(t("message.success"));
      setSubmitDisabled(true);
    } catch (error) {
      defaultErrorHandler({ error, defaultErrorMessage: t("message.error") });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!profileInfo.id) {
    return null;
  }

  return (
    <form>
      <Spin spinning={formLoading}>
        <Form
          onValuesChange={handleValuesChange}
          onFinish={isAdd ? onFinishAdd : onFinishEdit}
          layout="vertical"
          name="clientCardMain"
          form={form}
          initialValues={initialValues}
        >
          <Row
            gutter={[GUTTER_FULL_WIDTH.HORIZONTAL, GUTTER_FULL_WIDTH.VERTICAL]}
          >
            <FormContext.Provider value={form}>
              {tab?.fields?.map((field) => (
                <ComponentPermissionsChecker
                  key={field.fieldCode}
                  availablePermissions={field.permissions}
                  mode="readonly"
                  hasRight={formValues?.isOwner?.UPDATE}
                  field={field.fieldCode}
                >
                  {createFormField(field)}
                </ComponentPermissionsChecker>
              ))}
            </FormContext.Provider>
          </Row>
          <ComponentPermissionsChecker hasRight={formValues?.isOwner?.UPDATE}>
            <FormFooter
              loading={submitLoading}
              disabled={submitDisabled}
              withCancel={isAdd}
              onCancel={handleGoBack}
            />
          </ComponentPermissionsChecker>
        </Form>
      </Spin>
    </form>
  );
};

const mapStateToProps = (state: State) => ({
  profileInfo: state?.persist?.profileInfo,
  formLoading: state?.app?.formLoading,
});

export default connect(mapStateToProps)(Main);
