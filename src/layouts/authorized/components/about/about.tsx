import React, { useCallback, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";

import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import style from "./about.module.scss";
import packageJson from "../../../../../package.json";
import { ButtonLayout } from "../../../../components";

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
    <>
      <ButtonLayout onClick={handleClick} tooltip={t("tooltip")}>
        <QuestionCircleOutlined className={style.icon} />
      </ButtonLayout>
      <Modal visible={visible} onCancel={handleCancel} footer={null} centered>
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
    </>
  );
};

export default About;
