import styled from "@emotion/styled";
import React, { MouseEvent } from "react";
import CheckboxOnIcon from "assets/images/checkbox_on.svg";

interface IProps {
  checked?: boolean;
  onChange: (e: MouseEvent, v: boolean) => void;
  children?: React.ReactNode;
  size?: "small" | "medium";
}

export default function Checkbox(props: IProps) {
  return (
    <CheckboxStyle
      onClick={(e: MouseEvent) => props.onChange(e, !props.checked)}
    >
      <div className="check">
        {props.checked ? (
          <img src={CheckboxOnIcon} alt="" style={{ width: "16px" }} />
        ) : (
          <Box
            isSelectd={!!props.checked}
            size={"16"}
            style={{ borderRadius: "4px" }}
          />
        )}
      </div>

      {props.children}
    </CheckboxStyle>
  );
}

interface IboxStyle {
  isSelectd: boolean;
  size?: string;
}

const CheckboxStyle = styled.div`
  display: flex;
  align-items: start;
  gap: 10px;
  img {
    display: block;
  }
  .check {
    position: relative;
    top: 4px;
    cursor: pointer;
  }
`;

const Box = styled.span<IboxStyle>`
  display: flex;
  background: ${(props) => (props.isSelectd ? "#000" : "#D2CECA")};
  width: ${(props) => `${props.size || 16}px`};
  height: ${(props) => `${props.size || 16}px`};
  align-items: center;
  justify-content: center;
`;
