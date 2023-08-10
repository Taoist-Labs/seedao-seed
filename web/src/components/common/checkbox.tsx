import styled from "@emotion/styled";
import CheckboxOnIcon from "assets/images/checkbox_on.svg";

interface IProps {
  checked?: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
  size?: "small" | "medium";
}

export default function Checkbox(props: IProps) {
  return (
    <CheckboxStyle>
      <div onClick={() => props.onChange(!props.checked)}>
        {props.checked ? (
          <img
            src={CheckboxOnIcon}
            alt=""
            style={{ width: props.size === "medium" ? "32px" : "16px" }}
          />
        ) : (
          <Box
            isSelectd={!!props.checked}
            size={props.size === "medium" ? "32" : "16"}
            style={{ borderRadius: props.size === "medium" ? "8px" : "4px" }}
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
  align-items: center;
  gap: 10px;
  img {
    display: block;
  }
`;

const Box = styled.span<IboxStyle>`
  display: flex;
  background: ${(props) => (props.isSelectd ? "#000" : "#D2CECA")};
  width: ${(props) => `${props.size || 16}px`};
  height: ${(props) => `${props.size || 16}px`};
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
