import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import LogoIcon from "assets/images/logo.png";

export default function Header() {
  return (
    <HeaderStyle>
      <LogoBox to="/">
        <img src={LogoIcon} alt="" />
      </LogoBox>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.header`
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #ddd;
  padding: 10px 40px;
`;

const LogoBox = styled(Link)`
  img {
    height: 55px;
  }
`;
