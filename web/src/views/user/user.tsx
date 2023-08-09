import styled from "@emotion/styled";
import SeedCard from "./seedCard";

export default function UserPage() {
  return (
    <UserPageStyle>
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

const PageRight = styled.div`
  flex: 1;
  padding: 40px;
`;
