import styled from "@emotion/styled";
import Banner from "./banner";
import Utility from "./utility";
import Dynamic from "./dynamic";
import How2 from "./how2";
import FQA from "./FQA";
import { useMemo } from "react";
import Header from "components/layout/header";

export default function Home() {
  const color = useMemo(() => {
    const f = Math.round(Math.random());
    return f ? "#A6A2F9" : "#F9D9FB";
  }, []);
  return (
    <>
      <Header color={color} />
      <div className="mainContent">
        <HomePageStyle>
          <Banner color={color} />
          <Utility />
          <Dynamic color={color} />
          <How2 />
          <FQA color={color} />
        </HomePageStyle>
      </div>
    </>
  );
}
const HomePageStyle = styled.div``;
