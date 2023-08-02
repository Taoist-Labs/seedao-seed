import styled from "@emotion/styled";
import Banner from "./banner";
import Utility from "./utility";
import Rules from "./rules";
import FQA from "./FQA";

export default function Home() {
  return (
    <HomePageStyle>
      <Banner />
      <Utility />
      <Rules />
      <FQA />
    </HomePageStyle>
  );
}
const HomePageStyle = styled.div``;
