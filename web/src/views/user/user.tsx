import styled from "@emotion/styled";
import SeedCard from "./seedCard";

export default function UserPage() {
  return (
    <UserPageStyle>
      <PageLeft></PageLeft>
      <PageRight>
        <SeedCard />
      </PageRight>
    </UserPageStyle>
  );
}

const UserPageStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const PageLeft = styled.div`
  width: 240px;
  background: #fbf5ef;
  box-shadow: 2px 0px 8px 2px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 102px);
`;

const PageRight = styled.div`
  flex: 1;
  padding: 40px;
`;
