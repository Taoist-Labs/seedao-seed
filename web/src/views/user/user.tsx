import styled from "@emotion/styled";
import SeedCard from "./seedCard";
import { CenterBox } from "style";
import Header from "components/layout/header";

export default function UserPage() {
  return (
    <>
      <Header />
      <div className="mainContent">
        <UserPageStyle>
          <PageRight>
            <SeedCard />
          </PageRight>
        </UserPageStyle>
      </div>
    </>
  );
}

const UserPageStyle = styled(CenterBox)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const PageRight = styled.div`
  flex: 1;
  padding: 40px;
`;
