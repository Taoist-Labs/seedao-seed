import styled from "@emotion/styled";

interface IProps {
  checked?: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
  size?: number;
}

export default function Checkbox(props: IProps) {
  return (
    <CheckboxStyle>
      <Box
        isSelectd={!!props.checked}
        size={props.size}
        onClick={() => props.onChange(!props.checked)}
      >
        {props.checked && <span className="icon" />}
      </Box>

      {props.children}
    </CheckboxStyle>
  );
}

interface IboxStyle {
  isSelectd: boolean;
  size?: number;
}

const CheckboxStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Box = styled.span<IboxStyle>`
  display: flex;
  background: ${(props) => (props.isSelectd ? "#000" : "#D2CECA")};
  width: ${(props) => `${props.size || 16}px`};
  height: ${(props) => `${props.size || 16}px`};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  span.icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #c3f237;
    border-radius: 50%;
  }
`;
