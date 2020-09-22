import packageJson from "../../../../../package.json";
import React, { useCallback, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";

import style from "./about.module.scss";
import { useTranslation } from "react-i18next";
import { Button, Tooltip, Typography } from "antd";

const { Paragraph, Title } = Typography;

export const About = () => {
  const [t] = useTranslation("about");
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <div>
      <Tooltip title={t("tooltip")}>
        <div className={style.container} onClick={handleClick}>
          <QuestionCircleOutlined className={style.icon} />
        </div>
      </Tooltip>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("button.cancel")}
          </Button>,
        ]}
      >
        <Title level={5}>{t("title")}</Title>
        <br />
        <Paragraph>
          <strong>{`${t("title.version")}:`}</strong>
          <span style={{ marginLeft: "8px" }}>{packageJson.version}</span>
        </Paragraph>
        <Paragraph>
          <strong>{`${t("title.email")}:`}</strong>
          <a style={{ marginLeft: "8px" }} href={`mailto:${t("email")}`}>
            {t("email")}
          </a>
        </Paragraph>
      </Modal>
    </div>
  );
};

export default About;
