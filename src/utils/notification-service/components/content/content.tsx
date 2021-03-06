import React from "react";
import { ExtendedText } from "../../../../components";
import { DATE_FORMATS } from "../../../../constants";
import { getDateWithTimezone } from "../../../common";

import style from "./content.module.scss";

interface ContentProps {
  date: string;
  description?: React.ReactNode | string;
  ellipsis?: boolean;
}

export const Content: React.FC<ContentProps> = ({
  date,
  description,
  ellipsis = false,
}) => (
  <>
    <ExtendedText ellipsis={ellipsis}>{description}</ExtendedText>
    <ExtendedText className={style.time} size="small" type="secondary">
      {getDateWithTimezone(date).format(DATE_FORMATS.TIME)}
    </ExtendedText>
  </>
);

export default Content;
