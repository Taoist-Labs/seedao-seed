import styled from "@emotion/styled";
import Banner from "./banner";
import Utility from "./utility";
import Dynamic from "./dynamic";
import How2 from "./how2";
import FQA from "./FQA";
import { useMemo } from "react";
import Header from "components/layout/header";

import BannerBg01 from "assets/images/home/banner/banner01.png";
import BannerBg02 from "assets/images/home/banner/banner02.jpg";
import BannerBg03 from "assets/images/home/banner/banner03.png";
import BannerBg04 from "assets/images/home/banner/banner04.png";

import Footer from "components/layout/footer";

const COLORS = ["#F9D9FB", "#A6A2F9", "#B2D8D0", "#DFFCD4"];
const BANNER_IMGS = [BannerBg01, BannerBg02, BannerBg03, BannerBg04];

export default function Home() {
  const { color, bg } = useMemo(() => {
    const i = Math.floor(Math.random() * 4);
    return { color: COLORS[i], bg: BANNER_IMGS[i] };
  }, []);
  return (
    <>
      <Header color={color} />
      <div className="mainContent">
        <HomePageStyle>
          <Banner color={color} bg={bg} />
          <Utility />
          <Dynamic color={color} />
          <How2 />
          <FQA color={color} />
        </HomePageStyle>
        <Footer color={color} />
      </div>
    </>
  );
}
const HomePageStyle = styled.div``;
