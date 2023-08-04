import styled from "@emotion/styled";
import Banner from "./banner";
import Utility from "./utility";
import Dynamic from "./dynamic";
import FQA from "./FQA";

export default function Home() {
  return (
    <HomePageStyle>
      <Banner />
      <Utility />
      <Dynamic />
      <FQA />
    </HomePageStyle>
  );
}
const HomePageStyle = styled.div``;
