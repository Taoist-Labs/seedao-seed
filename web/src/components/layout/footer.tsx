import styled from "@emotion/styled";
import { CenterBox } from "style";

type props = {
  color?: string;
};

export default function Footer({ color }: props) {
  return (
    <FooterStyle color={color}>
      <FooterCenter>
        <span>© 2023 SeeDAO. All Rights Reserved.</span>
        <span>
          Powered with <span className="heart">❤️</span> by SeeDAO Seed Team.
        </span>
      </FooterCenter>
    </FooterStyle>
  );
}

const FooterStyle = styled.footer<props>`
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
  background-color: ${(props) => props.color || "#FBF5EF"};
  font-size: 12px;
`;

const FooterCenter = styled(CenterBox)`
  display: flex;
  justify-content: space-between;
  .heart {
    color: darkred;
  }
`;
